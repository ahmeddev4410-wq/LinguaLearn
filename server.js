const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));


// ===============================
// KELİME BİLGİLERİ
// ===============================

const wordInfo = {

    "masa": {
        meaning: "Üzerinde yemek yemek, çalışmak veya eşya koymak için kullanılan mobilya.",
        level: "A1 - Temel seviye",
        example: "The book is on the table.",
        alternatives: "desk"
    },

    "araba": {
        meaning: "İnsanları veya eşyaları taşımak için kullanılan motorlu araç.",
        level: "A1 - Temel seviye",
        example: "My car is new.",
        alternatives: "automobile"
    },

    "bilgisayar": {
        meaning: "Bilgi işlemek ve çeşitli işlemleri gerçekleştirmek için kullanılan elektronik cihaz.",
        level: "A1 - Temel seviye",
        example: "I use my computer every day.",
        alternatives: "PC"
    },

    "ev": {
        meaning: "İnsanların yaşadığı yapı.",
        level: "A1 - Temel seviye",
        example: "I am at home.",
        alternatives: "house, home"
    },

    "su": {
        meaning: "Canlıların yaşamı için gerekli olan sıvı.",
        level: "A1 - Temel seviye",
        example: "I drink water every day.",
        alternatives: "H₂O"
    },

    "kitap": {
        meaning: "Okumak için hazırlanmış yazılı veya basılı eser.",
        level: "A1 - Temel seviye",
        example: "I am reading a book.",
        alternatives: "volume"
    },

    "okul": {
        meaning: "Eğitim verilen kurum.",
        level: "A1 - Temel seviye",
        example: "The children go to school.",
        alternatives: "academy"
    },

    "öğretmen": {
        meaning: "Öğrencilere eğitim veren kişi.",
        level: "A1 - Temel seviye",
        example: "My teacher is very kind.",
        alternatives: "educator, instructor"
    },

    "öğrenci": {
        meaning: "Eğitim alan kişi.",
        level: "A1 - Temel seviye",
        example: "She is a student.",
        alternatives: "learner, pupil"
    },

    "arkadaş": {
        meaning: "Yakın ilişki kurduğun kişi.",
        level: "A1 - Temel seviye",
        example: "He is my best friend.",
        alternatives: "buddy, companion"
    },

    "telefon": {
        meaning: "İletişim kurmak için kullanılan elektronik cihaz.",
        level: "A1 - Temel seviye",
        example: "My phone is on the table.",
        alternatives: "mobile, smartphone"
    },

    "merhaba": {
        meaning: "Selamlaşmak için kullanılan bir kelime.",
        level: "A1 - Temel seviye",
        example: "Hello, how are you?",
        alternatives: "hi, hey"
    },

    "gün": {
        meaning: "24 saatlik zaman dilimi.",
        level: "A1 - Temel seviye",
        example: "Today is a beautiful day.",
        alternatives: "daytime"
    },

    "gece": {
        meaning: "Günün güneşin olmadığı karanlık bölümü.",
        level: "A1 - Temel seviye",
        example: "I sleep at night.",
        alternatives: "nighttime"
    },

    "sabah": {
        meaning: "Günün başlangıcındaki zaman dilimi.",
        level: "A1 - Temel seviye",
        example: "I drink coffee in the morning.",
        alternatives: "morning"
    },

    "anne": {
        meaning: "Çocuğu olan kadın; kişinin annesi.",
        level: "A1 - Temel seviye",
        example: "My mother is at home.",
        alternatives: "mom, mother"
    },

    "baba": {
        meaning: "Çocuğu olan erkek; kişinin babası.",
        level: "A1 - Temel seviye",
        example: "My father is a teacher.",
        alternatives: "dad, father"
    },

    "çocuk": {
        meaning: "Henüz yetişkin olmayan insan.",
        level: "A1 - Temel seviye",
        example: "The child is playing.",
        alternatives: "kid, youngster"
    }

};


// ===============================
// ÖZEL ÇEVİRİLER
// ===============================

const specialTranslations = {

    "masa": {
        "en": "table"
    },

    "araba": {
        "en": "car"
    },

    "bilgisayar": {
        "en": "computer"
    },

    "merhaba": {
        "en": "hello"
    },

    "ev": {
        "en": "house"
    },

    "su": {
        "en": "water"
    },

    "kitap": {
        "en": "book"
    },

    "okul": {
        "en": "school"
    },

    "öğretmen": {
        "en": "teacher"
    },

    "öğrenci": {
        "en": "student"
    },

    "arkadaş": {
        "en": "friend"
    },

    "telefon": {
        "en": "phone"
    },

    "gün": {
        "en": "day"
    },

    "gece": {
        "en": "night"
    },

    "sabah": {
        "en": "morning"
    },

    "anne": {
        "en": "mother"
    },

    "baba": {
        "en": "father"
    },

    "çocuk": {
        "en": "child"
    }

};


// ===============================
// DİL KODLARI
// ===============================

const languageCodes = {

    "Türkçe": "tr",
    "İngilizce": "en",
    "Almanca": "de",
    "Fransızca": "fr",
    "İspanyolca": "es"

};


// ===============================
// ÇEVİRİ API
// ===============================

app.post("/api/translate", async function(req, res) {

    const {
        text,
        source,
        target
    } = req.body;


    if (!text) {

        return res.status(400).json({
            error: "Çevrilecek metin bulunamadı."
        });

    }


    const cleanText =
        text.trim().toLowerCase();


    const targetCode =
        languageCodes[target] || target;


    const info =
        wordInfo[cleanText] || null;


    // Özel çeviri varsa onu kullan
    const specialTranslation =
        specialTranslations[cleanText]?.[targetCode];


    if (specialTranslation) {

        return res.json({

            translatedText: specialTranslation,

            meaning:
                info?.meaning ||
                "Anlam bilgisi bulunamadı.",

            level:
                info?.level ||
                "-",

            example:
                info?.example ||
                "-",

            alternatives:
                info?.alternatives ||
                "-"

        });

    }


    // Özel çeviri yoksa gerçek çeviri sunucusuna gönder
    try {

        const response =
            await fetch(
                "https://lingualearn-dfkz.onrender.com/translate",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        q: text,

                        source:
                            languageCodes[source] ||
                            source,

                        target:
                            targetCode,

                        format: "text"

                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Çeviri başarısız."
            );

        }


        return res.json({

            translatedText:
                data.translatedText,

            meaning:
                info?.meaning ||
                "Anlam bilgisi bulunamadı.",

            level:
                info?.level ||
                "-",

            example:
                info?.example ||
                "-",

            alternatives:
                info?.alternatives ||
                "-"

        });


    } catch (error) {

        console.error("EXACT ERROR:", error.message);

        return res.status(500).json({

            error: "Çeviri sunucusuna bağlanılamadı.",

            details: error.message

        });

    }

});


// ===============================
// SUNUCU
// ===============================

app.listen(3000, function() {

    console.log(
        "Lingualearn sunucusu http://localhost:3000 adresinde çalışıyor."
    );

});
