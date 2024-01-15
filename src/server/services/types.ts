export interface MadklubbenAPI {
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
