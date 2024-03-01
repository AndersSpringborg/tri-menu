import axios from "axios";
import pdf from "pdf-parse";
import { TRPCError } from "@trpc/server";
import { type MadklubbenAPI } from "~/server/services/types";
import { type Menu, type MenuLine } from "~/server/models/menuLine";
import { Allergies, FoodType } from "~/server/models/enums";

const PDF_URL = "https://madklubben.imgix.net";

const getPdfUrl = async (date: Date) => {
  const res = await axios.get<MadklubbenAPI>(
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

  const data = res.data;

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

const allergensMapping = new Map(
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
    .map((word) => allergensMapping.get(word))
    .filter((a) => a) as Allergies[];
}

const foodTypeMapping = new Map(
  Object.entries({
    svinekød: FoodType.Pork,
    skinke: FoodType.Pork,
    kylling: FoodType.Chicken,
    vegetarer: FoodType.Vegetarian,
    salat: FoodType.Vegetarian,
    vegan: FoodType.Vegan,
    kalkun: FoodType.Turkey,
    okse: FoodType.Beef,
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

function processMenuLine(item: string): MenuLine {
  // remove allergens
  let lines = item.split("\n");
  let type: FoodType = FoodType.Unknown;
  const allergies: Allergies[] = new Array<Allergies>();
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
  lines = lines.filter((l) => !l.includes("Kød"));

  lines = lines.map((l) => {
    if (l.includes("Til vegetarer:")) {
      type = FoodType.Vegan;
      return l.replace("Til vegetarer:", "");
    }
    return l;
  });

  lines.forEach((l) => {
    const foodType = getFoodtype(l);
    if (foodType !== FoodType.Unknown) {
      type = foodType;
    }
  });

  if (Allergies.Fish in allergies && type === FoodType.Unknown) {
    type = FoodType.Fish;
  }

  //concat
  const line = lines.join(" ");

  // reduce all multiple spaces to single space
  line.replace(/\s\s+/g, " ");
  return {
    allergies: allergies,
    item: line,
    label: type,
  };
}

export const getMenuFromMadklubben = async (date: Date): Promise<Menu> => {
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
      return {
        menuItems: items
          .map(processMenuLine)
          .filter((menu) => menu.item !== ""),
        textContent: textContent,
      };
    } else {
      console.log("Pattern not found");
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "Found the menu-url, but could not download the pdf for the date: " +
          date.toDateString(),
      });
    }
  } catch (error) {
    console.error("Error:", error);
    throw new TRPCError({
      code: "NOT_FOUND",
      message:
        "Found the menu-url, but could not download the pdf for the date: " +
        date.toDateString(),
    });
  }
};
