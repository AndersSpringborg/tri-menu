import axios from "axios";
import pdf from "pdf-parse";
import { TRPCError } from "@trpc/server";

export enum FoodType {
  Pork = "Pork",
  Chicken = "Chicken",
  Vegetarian = "Vegetarian",
  Vegan = "Vegan",
  Unknown = "Unknown",
}

export enum Allergies {
  Gluten = "Gluten",
  Lactose = "Lactose",
  Nuts = "Nuts",
  Peanuts = "Peanuts",
  Shellfish = "Shellfish",
  Fish = "Fish",
  Egg = "Egg",
  Soy = "Soy",
  Sesame = "Sesame",
  Celery = "Celery",
  Mustard = "Mustard",
  Molluscs = "Molluscs",
  Lupin = "Lupin",
  Sulfites = "Sulfites",
}

const PDF_URL = "https://madklubben.imgix.net";

const getPdfUrl = async (date: Date) => {
  const res = await fetch(
    "https://cdn.uheadless.com/api/url/frokostordninger/madklubben?token=98584f3e-a242-40ad-ae4f-291e37326580&depth=6&lang=en-us&domain=madklubben.dk",
    {
      headers: {
        accept: "application/json",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        Referer: "https://www.madklubben.dk/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      method: "GET",
    },
  );

  if (res.status < 200 || res.status >= 300) {
    return null;
  }

  const data = (await res.json()) as Root;

  const url = data.properties.menucards.map((item) => {
    const menucardMedia = item.properties.menucardMedia;
    if (!menucardMedia || menucardMedia.length === 0) return null;
    return item.properties.menucardMedia[0]!.properties.umbracoFile.src;
  });

  if (!url)
    throw new Error(
      "Could not find a menu for the date: " + date.toDateString(),
    );

  const month_date_str = `${date.getDate()}-${date.getMonth() + 1}`;
  return url.find((item) => item?.includes(month_date_str));
};

async function findPdfUrl(date: Date) {
  const pdfUrl = await getPdfUrl(date);
  // 11 december -> 11-12

  if (!pdfUrl)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Could not find a menu for the date: " + date.toDateString(),
    });
  return PDF_URL + pdfUrl;
}

const allergeneMapping = new Map(
  Object.entries({
    gluten: Allergies.Gluten,
    laktose: Allergies.Lactose,
    nødder: Allergies.Nuts,
    peanuts: Allergies.Peanuts,
    skaldyr: Allergies.Shellfish,
    fisk: Allergies.Fish,
    æg: Allergies.Egg,
    soja: Allergies.Soy,
    sesam: Allergies.Sesame,
    selleri: Allergies.Celery,
    sennep: Allergies.Mustard,
    bløddyr: Allergies.Molluscs,
    lupin: Allergies.Lupin,
    sulfitter: Allergies.Sulfites,
  }),
);

export function getAllergies(menuLine: string): Allergies[] {
  const lowerCaseMenuLine = menuLine.toLowerCase();
  const words = lowerCaseMenuLine.split(" ");

  return words
    .map((word) => allergeneMapping.get(word))
    .filter((a) => a) as Allergies[];
}

const foodTypeMapping = new Map(
  Object.entries({
    svinekød: FoodType.Pork,
    kylling: FoodType.Chicken,
    vegetarer: FoodType.Vegetarian,
    vegan: FoodType.Vegan,
  }),
);

export function getFoodtype(menuLine: string): FoodType {
  const lowerCaseMenuLine = menuLine.toLowerCase();
  const words = lowerCaseMenuLine.split(" ");
  const foodTypesInLine = words.map((word) => foodTypeMapping.get(word));
  const foodTypes = foodTypesInLine.filter((a) => a) as FoodType[];
  if (foodTypes.length === 0) {
    return FoodType.Unknown;
  }
  return foodTypes.pop()!;
}

function processMenuLine(item: string): {
  allergies: Allergies[];
  label: FoodType;
  items: string;
} {
  // remove allergens
  let lines = item.split("\n");
  let type = FoodType.Unknown;
  const allergies: Allergies[] = [];
  lines = lines.filter((l) => {
    if (l.includes("Allergener")) {
      allergies.push(...getAllergies(l));
      return false;
    }
    return true;
  });
  // remove pr percon
  lines = lines.filter((l) => !l.includes("pr. person"));
  // remove kød
  lines = lines.filter((l) => {
    if (l.includes("Kød")) {
      type = getFoodtype(l);
      return false;
    }
    return true;
  });

  //concat
  const line = lines.join(" ");

  // reduce all multiple spaces to single space
  line.replace(/\s\s+/g, " ");

  return {
    allergies: allergies,
    label: type,
    items: line.trim(),
  };
}

export const getMenuFromMadklubben = async (date: Date) => {
  const urlWithDate = await findPdfUrl(date);
  // Download the PDF file
  const response = await axios.get<ArrayBuffer>(urlWithDate, {
    responseType: "arraybuffer",
  });
  if (response.status < 200 || response.status >= 300) {
    console.error("Error:", response.statusText);
    throw new TRPCError({
      code: "NOT_FOUND",
      message:
        "Found the menu-url, but could not download the pdf for the date: " +
        date.toDateString(),
    });
  }

  try {
    const data = Buffer.from(response.data);

    // Parse the PDF content
    const pdfData = await pdf(data);
    const textContent = pdfData.text;

    const regex = /Salater([\s\S]*?)Rugbrød/g;
    const match = regex.exec(textContent);

    if (match?.[1]) {
      const items = match[1]
        .trim()
        .split("•")
        .map((item) => item.trim());
      // concat things on newlines
      // remove allergens
      console.log(items);
      return items.map(processMenuLine).filter((i) => i.items !== "");
    } else {
      console.log("Pattern not found");
    }
  } catch (error) {
    console.error("Error:", error);
  }
  return [];
};

export interface Root {
  _id: string;
  _ts: number;
  contentTypeAlias: string;
  createdAt: string;
  creatorId: number;
  creatorName: string;
  cultureData: CultureData;
  icon: string;
  id: number;
  languageCount: number;
  level: number;
  nodeName: string;
  nodeObjectType: string;
  parentId: number;
  path: number[];
  properties: Properties;
  published: boolean;
  sortOrder: number;
  trashed: boolean;
  udi: string;
  updatedAt: string;
  updaterID: number;
  updaterName: string;
  urlSegment: string;
  urls: Urls;
  uuid: string;
  varyByCulture: boolean;
  lang: string;
  domain: string;
  url: string;
}

export interface CultureData {
  "en-us": EnUs;
  da: Da;
  default: Default;
}

export interface CultureData8 {
  default: Default8;
}

export interface Properties20 {
  umbracoFile: UmbracoFile7;
  umbracoExtension: string;
  umbracoBytes: number;
}

export interface UmbracoFile7 {
  src: string;
  key: string;
  mediaKey: string;
}

export interface Urls {
  "en-us": string;
  da: string;
}

export interface EnUs {
  nm: string;
  us: string;
  dt: string;
  isd: boolean;
  domain: string;
}

export interface Da {
  nm: string;
  us: string;
  dt: string;
  isd: boolean;
  domain: string;
}

export interface Default {
  us: string;
  nm: string;
}

export interface Properties {
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  seoMedia: SeoMedum[];
  seoNoFollow: boolean;
  seoNoIndex: boolean;
  seoMetaTags: string;
  umbracoUrlName: string;
  seoH1: string;
  seoPrioritet: number;
  seoChangeFrequency: string;
  seoStructuredData: string;
  colorPrimary: string;
  colorSecondary: string;
  colorInvert: string;
  scheme: string;
  featuredMedia: FeaturedMedum[];
  links: string[];
  menuLabel: string;
  hideBackButton: string;
  modules: Module[];
  groups: Group2[];
  menucardDownload: MenucardDownload[];
  hideGoBackLink: string;
  contactTitle: string;
  contactContent: string;
  menucards: Menucard[];
}

export interface SeoMedum {
  _id: string;
  _ts: number;
  contentTypeAlias: string;
  createdAt: string;
  creatorId: number;
  creatorName: string;
  cultureData: CultureData2;
  data: string;
  icon: string;
  id: number;
  languageCount: number;
  level: number;
  nodeName: string;
  nodeObjectType: string;
  parentId: number;
  path: number[];
  properties: Properties2;
  published: boolean;
  sortOrder: number;
  trashed: boolean;
  updatedAt: string;
  updaterID: string;
  updaterName: string;
  urlSegment: string;
  uuid: string;
  lang: string;
}

export interface CultureData2 {
  default: Default2;
}

export interface Default2 {
  us: string;
  nm: string;
}

export interface Properties2 {
  umbracoFile: UmbracoFile;
  altText: string;
  umbracoWidth: number;
  umbracoHeight: number;
  umbracoBytes: number;
  umbracoExtension: string;
}

export interface UmbracoFile {
  src: string;
  key: string;
  mediaKey: string;
}

export interface FeaturedMedum {
  udi: string;
  contentTypeKey: string;
  contentTypeAlias: string;
  properties: Properties3;
}

export interface Properties3 {
  value: Value[];
}

export interface Value {
  _id: string;
  _ts: number;
  contentTypeAlias: string;
  createdAt: string;
  creatorId: number;
  creatorName: string;
  cultureData: CultureData3;
  data: string;
  icon: string;
  id: number;
  languageCount: number;
  level: number;
  nodeName: string;
  nodeObjectType: string;
  parentId: number;
  path: number[];
  properties: Properties4;
  published: boolean;
  sortOrder: number;
  trashed: boolean;
  updatedAt: string;
  updaterID: string;
  updaterName: string;
  urlSegment: string;
  uuid: string;
  lang: string;
}

export interface CultureData3 {
  default: Default3;
}

export interface Default3 {
  us: string;
  nm: string;
}

export interface Properties4 {
  umbracoFile: UmbracoFile2;
  altText: string;
  umbracoWidth: number;
  umbracoHeight: number;
  umbracoBytes: number;
  umbracoExtension: string;
}

export interface UmbracoFile2 {
  src: string;
  key: string;
  mediaKey: string;
}

export interface Module {
  udi: string;
  contentTypeKey: string;
  contentTypeAlias: string;
  properties: Properties5;
}

export interface Properties5 {
  media?: Medum[];
  ctas?: Cta[];
  title?: string;
  useScreenHeight?: boolean;
  columns?: boolean;
  content?: string;
  callToActions?: CallToAction[];
  center?: boolean;
  images?: Image[];
  useDarkTheme?: boolean;
  featuredItems?: FeaturedItem[];
  menues?: Menue[];
  itemID?: string;
  accordionItems?: AccordionItem[];
  slides?: Slide[];
  form?: Form;
  description?: string;
  buttonLabel?: string;
  submitText?: string;
}

export interface Medum {
  udi: string;
  contentTypeKey: string;
  contentTypeAlias: string;
  properties: Properties6;
}

export interface Properties6 {
  value: Value2[];
}

export interface Value2 {
  _id: string;
  _ts: number;
  contentTypeAlias: string;
  createdAt: string;
  creatorId: number;
  creatorName: string;
  cultureData: CultureData4;
  data: string;
  icon: string;
  id: number;
  languageCount: number;
  level: number;
  nodeName: string;
  nodeObjectType: string;
  parentId: number;
  path: number[];
  properties: Properties7;
  published: boolean;
  sortOrder: number;
  trashed: boolean;
  updatedAt: string;
  updaterID: string;
  updaterName: string;
  urlSegment: string;
  uuid: string;
  lang: string;
}

export interface CultureData4 {
  default: Default4;
}

export interface Default4 {
  us: string;
  nm: string;
}

export interface Properties7 {
  umbracoFile: UmbracoFile3;
  altText: string;
  umbracoWidth: number;
  umbracoHeight: number;
  umbracoBytes: number;
  umbracoExtension: string;
}

export interface UmbracoFile3 {
  src: string;
  key: string;
  mediaKey: string;
}

export interface Cta {
  name: string;
  url: string;
  queryString: string;
  udi?: string;
  contentTypeAlias?: string;
  lang?: string;
  _type?: string;
}

export interface CallToAction {
  name: string;
  udi?: string;
  queryString?: string;
  contentTypeAlias?: string;
  lang?: string;
  url: string;
  _type?: string;
}

export interface Image {
  _id: string;
  _ts: number;
  contentTypeAlias: string;
  createdAt: string;
  creatorId: number;
  creatorName: string;
  cultureData: CultureData5;
  data: string;
  icon: string;
  id: number;
  languageCount: number;
  level: number;
  nodeName: string;
  nodeObjectType: string;
  parentId: number;
  path: number[];
  properties: Properties8;
  published: boolean;
  sortOrder: number;
  trashed: boolean;
  updatedAt: string;
  updaterID: string;
  updaterName: string;
  urlSegment: string;
  uuid: string;
  lang: string;
}

export interface CultureData5 {
  default: Default5;
}

export interface Default5 {
  us: string;
  nm: string;
}

export interface Properties8 {
  umbracoFile: UmbracoFile4;
  altText: string;
  umbracoWidth: number;
  umbracoHeight: number;
  umbracoBytes: number;
  umbracoExtension: string;
}

export interface UmbracoFile4 {
  src: string;
  key: string;
  mediaKey: string;
}

export interface FeaturedItem {
  udi: string;
  contentTypeKey: string;
  contentTypeAlias: string;
  properties: Properties9;
}

export interface Properties9 {
  title: string;
  content: string;
  value: string;
  key: string;
}

export interface Menue {
  udi: string;
  contentTypeKey: string;
  contentTypeAlias: string;
  properties: Properties10;
}

export interface Properties10 {
  title: string;
  link: Link[];
  groups: Group[];
}

export interface Link {
  name: string;
  udi: string;
  queryString: string;
  contentTypeAlias: string;
  lang: string;
  url: string;
  _type: string;
}

export interface Group {
  udi: string;
  contentTypeKey: string;
  contentTypeAlias: string;
  properties: Properties11;
}

export interface Properties11 {
  cta: string[];
  items: Item[];
  title: string;
  description: string;
}

export interface Item {
  udi: string;
  contentTypeKey: string;
  contentTypeAlias: string;
  properties: Properties12;
}

export interface Properties12 {
  allergenes: string[];
  title: string;
  content: string;
  images: Image2[];
}

export interface Image2 {
  _id: string;
  _ts: number;
  contentTypeAlias: string;
  createdAt: string;
  creatorId: number;
  creatorName: string;
  cultureData: CultureData6;
  data: string;
  icon: string;
  id: number;
  languageCount: number;
  level: number;
  nodeName: string;
  nodeObjectType: string;
  parentId: number;
  path: number[];
  properties: Properties13;
  published: boolean;
  sortOrder: number;
  trashed: boolean;
  updatedAt: string;
  updaterID: string;
  updaterName: string;
  urlSegment: string;
  uuid: string;
  lang: string;
}

export interface CultureData6 {
  default: Default6;
}

export interface Default6 {
  us: string;
  nm: string;
}

export interface Properties13 {
  umbracoFile: UmbracoFile5;
  altText: string;
  umbracoWidth: number;
  umbracoHeight: number;
  umbracoBytes: number;
  umbracoExtension: string;
}

export interface UmbracoFile5 {
  src: string;
  key: string;
  mediaKey: string;
}

export interface AccordionItem {
  udi: string;
  contentTypeKey: string;
  contentTypeAlias: string;
  properties: Properties14;
}

export interface Properties14 {
  title: string;
  content: string;
}

export interface Slide {
  udi: string;
  contentTypeKey: string;
  contentTypeAlias: string;
  properties: Properties15;
}

export interface Properties15 {
  images: Image3[];
}

export interface Image3 {
  _id: string;
  _ts: number;
  contentTypeAlias: string;
  createdAt: string;
  creatorId: number;
  creatorName: string;
  cultureData: CultureData7;
  data: string;
  icon: string;
  id: number;
  languageCount: number;
  level: number;
  nodeName: string;
  nodeObjectType: string;
  parentId: number;
  path: number[];
  properties: Properties16;
  published: boolean;
  sortOrder: number;
  trashed: boolean;
  updatedAt: string;
  updaterID: string;
  updaterName: string;
  urlSegment: string;
  uuid: string;
  lang: string;
}

export interface CultureData7 {
  default: Default7;
}

export interface Default7 {
  us: string;
  nm: string;
}

export interface Properties16 {
  umbracoFile: UmbracoFile6;
  altText: string;
  umbracoWidth: number;
  umbracoHeight: number;
  umbracoBytes: number;
  umbracoExtension: string;
}

export interface UmbracoFile6 {
  src: string;
  key: string;
  mediaKey: string;
}

export interface Form {
  _id: string;
  _ts: number;
  createdAt: string;
  definition: string;
  id: number;
  updatedAt: string;
}

export interface Group2 {
  udi: string;
  contentTypeKey: string;
  contentTypeAlias: string;
  properties: Properties17;
}

export interface Properties17 {
  groupTitle: string;
  days: Day[];
}

export interface Day {
  udi: string;
  contentTypeKey: string;
  contentTypeAlias: string;
  properties: Properties18;
}

export interface Properties18 {
  days: string;
  timeFrom: string;
  timeTo: string;
}

export interface MenucardDownload {
  name: string;
  udi: string;
  contentTypeAlias: string;
  lang: string;
  url: string;
  _type: string;
}

export interface Menucard {
  udi: string;
  contentTypeKey: string;
  contentTypeAlias: string;
  properties: Properties19;
}

export interface Properties19 {
  menucardMedia: MenucardMedum[];
  menucardPages: number;
  type: string;
}

export interface MenucardMedum {
  _id: string;
  _ts: number;
  contentTypeAlias: string;
  createdAt: string;
  creatorId: number;
  creatorName: string;
  cultureData: CultureData8;
  data: string;
  icon: string;
  id: number;
  languageCount: number;
  level: number;
  nodeName: string;
  nodeObjectType: string;
  parentId: number;
  path: number[];
  properties: Properties20;
  published: boolean;
  sortOrder: number;
  trashed: boolean;
  updatedAt: string;
  updaterID: string;
  updaterName: string;
  urlSegment: string;
  uuid: string;
  lang: string;
}

export interface Default8 {
  us: string;
  nm: string;
}
