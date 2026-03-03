import { GoogleGenAI } from "@google/genai";
import { menuData } from "../data/menu";

const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });

const compactMenu = menuData.items.map((i) => ({
  name: i.name,
  price: i.price,
  category: i.category,
  description: i.description,
  milk: !!i.milk,
}));

const systemInstruction = `
Sen Brosso Coffee için premium bir "Barista Asistanı"sın.
Ton: kısa, net, premium; zorlama espri yok; emoji yok.
Görev:
- Menüden ürün fiyatı, içerik, öneri, kategori listesi üret.
- Kullanıcı "tatlı bir şeyler", "soğuk ne var" gibi genel öneri isterse, menüdeki uygun ürünlerden 2-3 tane cazip öneri sun ve kısaca neden önerdiğini belirt.
- Kullanıcı belirsiz sorarsa 1 net soru sor.
- Cevaplarda mümkünse ürün adlarını aynen yaz.
- Eğer ürün bulunamazsa bunu söyle ve benzer 2-3 seçenek öner.
Format:
- Liste istenirse madde madde yaz.
- Fiyat yazarken "₺" kullan.

Güncel Menü (JSON özet):
${JSON.stringify(compactMenu).slice(0, 15000)}
`;

// Sohbet geçmişini tutmak için chat oturumu başlatıyoruz
const chat = ai.chats.create({
  model: "gemini-3-flash-preview",
  config: {
    systemInstruction,
    temperature: 0.6,
  },
});

export const getGeminiResponse = async (userMessage: string) => {
  try {
    const response = await chat.sendMessage({ message: userMessage });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Bir hata oluştu. Lütfen tekrar dener misin?";
  }
};
