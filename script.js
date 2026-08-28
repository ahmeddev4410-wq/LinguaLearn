// ==========================================
// LINGUALEARN - DİL LİSTESİ
// ==========================================

const languages = {
    "Türkçe": "tr",
    "İngilizce": "en",
    "Almanca": "de",
    "Fransızca": "fr",
    "İspanyolca": "es",
    "İtalyanca": "it",
    "Portekizce": "pt",
    "Felemenkçe": "nl",
    "Danca": "da",
    "İsveççe": "sv",
    "Norveççe": "nb",
    "Fince": "fi",
    "İzlandaca": "is",
    "Lehçe": "pl",
    "Çekçe": "cs",
    "Slovakça": "sk",
    "Slovence": "sl",
    "Hırvatça": "hr",
    "Sırpça": "sr",
    "Bulgarca": "bg",
    "Romence": "ro",
    "Macarca": "hu",
    "Yunanca": "el",
    "Ukraynaca": "uk",
    "Rusça": "ru",
    "Litvanca": "lt",
    "Letonca": "lv",
    "Estonca": "et",
    "Ermenice": "hy",
    "Gürcüce": "ka",
    "Azerbaycanca": "az",
    "Kazakça": "kk",
    "Kırgızca": "ky",
    "Özbekçe": "uz",
    "Türkmence": "tk",
    "Arapça": "ar",
    "İbranice": "he",
    "Farsça": "fa",
    "Hintçe": "hi",
    "Bengalce": "bn",
    "Tamilce": "ta",
    "Teluguca": "te",
    "Marathice": "mr",
    "Çince": "zh",
    "Japonca": "ja",
    "Korece": "ko",
    "Vietnamca": "vi",
    "Endonezce": "id",
    "Malayca": "ms",
    "Filipince": "tl",
    "Tayca": "th",
    "Svahili": "sw",
    "Somalice": "so",
    "İrlandaca": "ga",
    "Galce": "cy",
    "Kürtçe": "kmr"
};


// ==========================================
// DİL KUTULARI
// ==========================================

const sourceSelect =
    document.getElementById("sourceLanguage");

const targetSelect =
    document.getElementById("targetLanguage");

const swapButton =
    document.querySelector(".swap");


function fillLanguages(select) {

    if (!select) return;

    select.innerHTML = "";

    Object.keys(languages).forEach(function(language) {

        const option =
            document.createElement("option");

        option.textContent = language;
        option.value = languages[language];

        select.appendChild(option);
    });
}


fillLanguages(sourceSelect);
fillLanguages(targetSelect);


if (sourceSelect) {
    sourceSelect.value = "tr";
}


if (targetSelect) {
    targetSelect.value = "en";
}


if (swapButton) {

    swapButton.addEventListener("click", function() {

        const oldSource = sourceSelect.value;
        const oldTarget = targetSelect.value;

        sourceSelect.value = oldTarget;
        targetSelect.value = oldSource;

    });

}


// ==========================================
// ÇEVİRİ
// ==========================================

const translateButton =
    document.querySelector(".translate-button");


if (translateButton) {

    translateButton.addEventListener(
        "click",
        async function() {

            const text =
                document
                    .getElementById("textInput")
                    .value
                    .trim();


            if (text === "") {

                alert(
                    "Lütfen çevirmek istediğin kelime veya cümleyi yaz."
                );

                return;
            }


            const source =
                sourceSelect.value;

            const target =
                targetSelect.value;


            document.getElementById("translation")
                .textContent =
                "Çeviri hazırlanıyor...";

            document.getElementById("meaning")
                .textContent =
                "Bilgi hazırlanıyor...";

            document.getElementById("level")
                .textContent =
                "Bilgi hazırlanıyor...";

            document.getElementById("example")
                .textContent =
                "Bilgi hazırlanıyor...";

            document.getElementById("alternatives")
                .textContent =
                "Bilgi hazırlanıyor...";


            try {

                const response =
                    await fetch("/api/translate", {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            text: text,
                            source: source,
                            target: target

                        })

                    });


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.error || "Çeviri başarısız."
                    );

                }


                document.getElementById("translation")
                    .textContent =
                    data.translatedText ||
                    "Çeviri bulunamadı.";


                document.getElementById("meaning")
                    .textContent =
                    data.meaning ||
                    "Anlam bilgisi bulunamadı.";


                document.getElementById("level")
                    .textContent =
                    data.level || "-";


                document.getElementById("example")
                    .textContent =
                    data.example || "-";


                document.getElementById("alternatives")
                    .textContent =
                    data.alternatives || "-";


                saveToHistory(
                    text,
                    data.translatedText
                );

            } catch (error) {

                console.error(error);


                document.getElementById("translation")
                    .textContent =
                    "Çeviri yapılamadı.";


                document.getElementById("meaning")
                    .textContent =
                    error.message;


                document.getElementById("level")
                    .textContent =
                    "-";


                document.getElementById("example")
                    .textContent =
                    "-";


                document.getElementById("alternatives")
                    .textContent =
                    "-";

            }

        }
    );

}


// ==========================================
// KOPYALA
// ==========================================

const copyButton =
    document.getElementById("copyButton");


if (copyButton) {

    copyButton.addEventListener(
        "click",
        async function() {

            const translation =
                document
                    .getElementById("translation")
                    .textContent
                    .trim();


            if (
                translation === "" ||
                translation ===
                "Çeviri sonucu burada görünecek."
            ) {

                alert("Önce bir çeviri yap.");

                return;
            }


            try {

                await navigator.clipboard.writeText(
                    translation
                );


                copyButton.textContent =
                    "✅ Kopyalandı!";


                setTimeout(function() {

                    copyButton.textContent =
                        "📋 Kopyala";

                }, 1500);


            } catch (error) {

                alert("Çeviri kopyalanamadı.");

            }

        }
    );

}


// ==========================================
// SESLENDİR
// ==========================================

const speakButton =
    document.getElementById("speakButton");


if (speakButton) {

    speakButton.addEventListener(
        "click",
        function() {

            const translation =
                document
                    .getElementById("translation")
                    .textContent
                    .trim();


            if (
                translation === "" ||
                translation ===
                "Çeviri sonucu burada görünecek."
            ) {

                alert("Önce bir çeviri yap.");

                return;
            }


            const speech =
                new SpeechSynthesisUtterance(
                    translation
                );


            speech.lang =
                targetSelect.value;


            window.speechSynthesis.cancel();

            window.speechSynthesis.speak(
                speech
            );

        }
    );

}


// ==========================================
// GEÇMİŞ
// ==========================================

const historyContainer =
    document.getElementById("history");


const clearHistoryButton =
    document.getElementById(
        "clearHistoryButton"
    );


function loadHistory() {

    if (!historyContainer) return;


    const history =
        JSON.parse(
            localStorage.getItem(
                "lingualearnHistory"
            )
        ) || [];


    if (history.length === 0) {

        historyContainer.textContent =
            "Henüz çeviri yapılmadı.";

        return;
    }


    historyContainer.innerHTML = "";


    history.forEach(function(item) {

        const historyItem =
            document.createElement("div");


        historyItem.className =
            "history-item";


        historyItem.textContent =
            item.sourceText +
            " → " +
            item.translation;


        historyContainer.appendChild(
            historyItem
        );

    });

}


function saveToHistory(
    sourceText,
    translation
) {

    let history =
        JSON.parse(
            localStorage.getItem(
                "lingualearnHistory"
            )
        ) || [];


    history.unshift({

        sourceText:
            sourceText,

        translation:
            translation

    });


    history =
        history.slice(0, 20);


    localStorage.setItem(
        "lingualearnHistory",
        JSON.stringify(history)
    );


    loadHistory();

}


if (clearHistoryButton) {

    clearHistoryButton.addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                "lingualearnHistory"
            );

            loadHistory();

        }
    );

}


loadHistory();


// ==========================================
// FAVORİLER
// ==========================================

const favoriteButton =
    document.getElementById(
        "favoriteButton"
    );


const favoritesContainer =
    document.getElementById(
        "favorites"
    );


const clearFavoritesButton =
    document.getElementById(
        "clearFavoritesButton"
    );


// Favorileri göster
function loadFavorites() {

    if (!favoritesContainer) return;


    const favorites =
        JSON.parse(
            localStorage.getItem(
                "lingualearnFavorites"
            )
        ) || [];


    if (favorites.length === 0) {

        favoritesContainer.textContent =
            "Henüz favori eklenmedi.";

        return;
    }


    favoritesContainer.innerHTML = "";


    favorites.forEach(function(item) {

        const favoriteItem =
            document.createElement("div");


        favoriteItem.className =
            "favorite-item";


        favoriteItem.textContent =
            item.sourceText +
            " → " +
            item.translation;


        favoritesContainer.appendChild(
            favoriteItem
        );

    });

}


// Çeviri sonucunu favoriye ekle
if (favoriteButton) {

    favoriteButton.addEventListener(
        "click",
        function() {

            const sourceText =
                document
                    .getElementById("textInput")
                    .value
                    .trim();


            const translation =
                document
                    .getElementById("translation")
                    .textContent
                    .trim();


            if (
                sourceText === "" ||
                translation === "" ||
                translation ===
                "Çeviri sonucu burada görünecek."
            ) {

                alert("Önce bir çeviri yap.");

                return;
            }


            let favorites =
                JSON.parse(
                    localStorage.getItem(
                        "lingualearnFavorites"
                    )
                ) || [];


            const alreadyExists =
                favorites.some(
                    function(item) {

                        return (
                            item.sourceText ===
                            sourceText &&
                            item.translation ===
                            translation
                        );

                    }
                );


            if (alreadyExists) {

                favoriteButton.textContent =
                    "❤️ Zaten Favorilerde!";


                setTimeout(function() {

                    favoriteButton.textContent =
                        "❤️ Favoriye Ekle";

                }, 1500);


                return;
            }


            favorites.unshift({

                sourceText:
                    sourceText,

                translation:
                    translation

            });


            localStorage.setItem(
                "lingualearnFavorites",
                JSON.stringify(favorites)
            );


            favoriteButton.textContent =
                "❤️ Favoriye Eklendi!";


            setTimeout(function() {

                favoriteButton.textContent =
                    "❤️ Favoriye Ekle";

            }, 1500);


            loadFavorites();

        }
    );

}


// Favorileri temizle
if (clearFavoritesButton) {

    clearFavoritesButton.addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                "lingualearnFavorites"
            );

            loadFavorites();

        }
    );

}


loadFavorites();


// ==========================================
// GÜNÜN KELİMESİ
// ==========================================

const dailyWords = [

    {
        word: "beautiful",
        meaning:
            "Güzel, hoş veya estetik açıdan beğenilen.",
        example:
            "She has a beautiful smile.",
        level:
            "A1 - Temel seviye"
    },

    {
        word: "friend",
        meaning:
            "Yakın ilişki kurduğun kişi.",
        example:
            "He is my best friend.",
        level:
            "A1 - Temel seviye"
    },

    {
        word: "water",
        meaning:
            "Canlıların yaşamı için gerekli olan sıvı.",
        example:
            "I drink water every day.",
        level:
            "A1 - Temel seviye"
    },

    {
        word: "school",
        meaning:
            "Eğitim verilen kurum.",
        example:
            "The children go to school.",
        level:
            "A1 - Temel seviye"
    }

];


const today =
    new Date().getDate() %
    dailyWords.length;


const dailyWord =
    dailyWords[today];


const dailyWordElement =
    document.getElementById(
        "dailyWord"
    );


const dailyMeaningElement =
    document.getElementById(
        "dailyMeaning"
    );


const dailyExampleElement =
    document.getElementById(
        "dailyExample"
    );


const dailyLevelElement =
    document.getElementById(
        "dailyLevel"
    );


if (dailyWordElement) {

    dailyWordElement.textContent =
        dailyWord.word;

}


if (dailyMeaningElement) {

    dailyMeaningElement.textContent =
        dailyWord.meaning;

}


if (dailyExampleElement) {

    dailyExampleElement.textContent =
        "💬 " +
        dailyWord.example;

}


if (dailyLevelElement) {

    dailyLevelElement.textContent =
        dailyWord.level;

}


// Günün kelimesini seslendir
const dailySpeakButton =
    document.getElementById(
        "dailySpeakButton"
    );


if (dailySpeakButton) {

    dailySpeakButton.addEventListener(
        "click",
        function() {

            const word =
                document
                    .getElementById(
                        "dailyWord"
                    )
                    .textContent;


            const speech =
                new SpeechSynthesisUtterance(
                    word
                );


            speech.lang =
                "en-US";


            window.speechSynthesis.cancel();

            window.speechSynthesis.speak(
                speech
            );

        }
    );

}


// Günün kelimesini favoriye ekle
const dailyFavoriteButton =
    document.getElementById(
        "dailyFavoriteButton"
    );


if (dailyFavoriteButton) {

    dailyFavoriteButton.addEventListener(
        "click",
        function() {

            const word =
                document
                    .getElementById(
                        "dailyWord"
                    )
                    .textContent
                    .trim();


            const meaning =
                document
                    .getElementById(
                        "dailyMeaning"
                    )
                    .textContent
                    .trim();


            const example =
                document
                    .getElementById(
                        "dailyExample"
                    )
                    .textContent
                    .trim();


            let favorites =
                JSON.parse(
                    localStorage.getItem(
                        "lingualearnFavorites"
                    )
                ) || [];


            const alreadyExists =
                favorites.some(
                    function(item) {

                        return (
                            item.sourceText ===
                            word &&
                            item.translation ===
                            word
                        );

                    }
                );


            if (alreadyExists) {

                dailyFavoriteButton.textContent =
                    "❤️ Zaten Favorilerde!";


                setTimeout(function() {

                    dailyFavoriteButton.textContent =
                        "❤️ Favoriye Ekle";

                }, 1500);


                return;
            }


            favorites.unshift({

                sourceText:
                    word,

                translation:
                    word,

                meaning:
                    meaning,

                example:
                    example

            });


            localStorage.setItem(
                "lingualearnFavorites",
                JSON.stringify(favorites)
            );


            dailyFavoriteButton.textContent =
                "❤️ Favoriye Eklendi!";


            setTimeout(function() {

                dailyFavoriteButton.textContent =
                    "❤️ Favoriye Ekle";

            }, 1500);


            loadFavorites();

        }
    );

}


// ==========================================
// QUIZ
// ==========================================

const quizWords = [

    {
        word: "school",
        answer: "Okul",
        options: [
            "Ev",
            "Okul",
            "Su",
            "Kitap"
        ]
    },

    {
        word: "water",
        answer: "Su",
        options: [
            "Araba",
            "Su",
            "Okul",
            "Arkadaş"
        ]
    },

    {
        word: "house",
        answer: "Ev",
        options: [
            "Kitap",
            "Ev",
            "Su",
            "Okul"
        ]
    },

    {
        word: "friend",
        answer: "Arkadaş",
        options: [
            "Arkadaş",
            "Ev",
            "Kitap",
            "Araba"
        ]
    },

    {
        word: "book",
        answer: "Kitap",
        options: [
            "Su",
            "Okul",
            "Kitap",
            "Ev"
        ]
    },

    {
        word: "car",
        answer: "Araba",
        options: [
            "Araba",
            "Arkadaş",
            "Kitap",
            "Su"
        ]
    }

];


let quizScore = 0;
let correctAnswers = 0;
let quizQuestionNumber = 0;
let currentQuiz = null;


const totalQuizQuestions = 10;


const quizQuestionElement =
    document.getElementById(
        "quizQuestion"
    );


const quizOptionsElement =
    document.getElementById(
        "quizOptions"
    );


const quizResultElement =
    document.getElementById(
        "quizResult"
    );


const quizScoreElement =
    document.getElementById(
        "quizScore"
    );


const nextQuizButton =
    document.getElementById(
        "nextQuizButton"
    );


// Quiz sorusu oluştur
function createQuizQuestion() {

    if (
        !quizQuestionElement ||
        !quizOptionsElement ||
        !quizResultElement
    ) {
        return;
    }


    if (
        quizQuestionNumber >=
        totalQuizQuestions
    ) {

        showQuizResult();

        return;
    }


    quizQuestionNumber++;


    const randomIndex =
        Math.floor(
            Math.random() *
            quizWords.length
        );


    currentQuiz =
        quizWords[randomIndex];


    quizQuestionElement.textContent =
        `Soru ${quizQuestionNumber}/10: "${currentQuiz.word}" ne demektir?`;


    quizOptionsElement.innerHTML = "";

    quizResultElement.textContent = "";


    currentQuiz.options.forEach(
        function(option) {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "quiz-option";


            button.textContent =
                option;


            button.addEventListener(
                "click",
                function() {

                    checkQuizAnswer(
                        option
                    );

                }
            );


            quizOptionsElement.appendChild(
                button
            );

        }
    );

}


// Cevabı kontrol et
function checkQuizAnswer(answer) {

    const buttons =
        document.querySelectorAll(
            ".quiz-option"
        );


    buttons.forEach(
        function(button) {

            button.disabled = true;

        }
    );


    if (
        answer ===
        currentQuiz.answer
    ) {

        correctAnswers++;
        quizScore++;


        quizResultElement.textContent =
            "✅ Doğru cevap!";


        if (quizScoreElement) {

            quizScoreElement.textContent =
                quizScore;

        }

    } else {

        quizResultElement.textContent =
            "❌ Yanlış! Doğru cevap: " +
            currentQuiz.answer;

    }


    if (nextQuizButton) {

        nextQuizButton.textContent =
            quizQuestionNumber >=
            totalQuizQuestions
                ? "🏆 Sonucu Gör"
                : "➡️ Sonraki Soru";

    }

}


// Quiz sonucunu göster
function showQuizResult() {

    const percentage =
        correctAnswers * 10;


    let message;


    if (percentage >= 90) {

        message =
            "🏆 Mükemmel!";

    } else if (percentage >= 70) {

        message =
            "🎉 Çok iyi!";

    } else if (percentage >= 50) {

        message =
            "👍 İyi gidiyorsun!";

    } else {

        message =
            "📚 Biraz daha pratik yap!";

    }


    if (quizQuestionElement) {

        quizQuestionElement.textContent =
            "🏆 Test Tamamlandı!";

    }


    if (quizOptionsElement) {

        quizOptionsElement.innerHTML =
            "";

    }


    if (quizResultElement) {

        quizResultElement.textContent =
            `${correctAnswers} / 10 doğru — %${percentage} başarı`;

    }


    if (nextQuizButton) {

        nextQuizButton.textContent =
            message +
            " 🔄 Tekrar Dene";


        nextQuizButton.onclick =
            function() {

                startQuiz();

            };

    }

}


// Quiz'i başlat
function startQuiz() {

    quizScore = 0;
    correctAnswers = 0;
    quizQuestionNumber = 0;


    if (quizScoreElement) {

        quizScoreElement.textContent =
            "0";

    }


    if (nextQuizButton) {

        nextQuizButton.onclick =
            null;


        nextQuizButton.textContent =
            "➡️ Sonraki Soru";

    }


    createQuizQuestion();

}


if (nextQuizButton) {

    nextQuizButton.addEventListener(
        "click",
        function() {

            if (
                quizQuestionNumber <
                totalQuizQuestions
            ) {

                createQuizQuestion();

            }

        }
    );

}


startQuiz();


// ==========================================
// LINGUALEARN BİTTİ
// ==========================================