
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)


# ==========================================
# WORDS.JSON DOSYASINI OKU
# ==========================================

WORDS_FILE = os.path.join(
    os.path.dirname(__file__),
    "words.json"
)


def load_words():
    try:
        with open(
            WORDS_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            data = json.load(file)

            print("words.json başarıyla yüklendi.")

            print("Dosya yolu:", WORDS_FILE)

            return data

    except FileNotFoundError:

        print("HATA: words.json bulunamadı.")

        return {}

    except json.JSONDecodeError as error:

        print("HATA: words.json geçerli bir JSON değil.")
        print(error)

        return {}

    except Exception as error:

        print("words.json okunamadı:")
        print(error)

        return {}


words = load_words()


# ==========================================
# KELİME ARAMA
# ==========================================

def find_word(text, source, target):

    clean_text = text.strip().lower()

    # Türkçe → İngilizce
    if source == "tr" and target == "en":

        for level, word_list in words.items():

            if not isinstance(word_list, list):
                continue

            for item in word_list:

                if not isinstance(item, dict):
                    continue

                translation = str(
                    item.get("translation", "")
                ).strip().lower()

                if translation == clean_text:

                    return {
                        "translatedText": item.get(
                            "word",
                            ""
                        ),
                        "meaning": item.get(
                            "meaning",
                            "Anlam bilgisi bulunamadı."
                        ),
                        "level": item.get(
                            "level",
                            level
                        ),
                        "example": item.get(
                            "example",
                            "-"
                        ),
                        "alternatives": item.get(
                            "alternatives",
                            "-"
                        )
                    }

    # İngilizce → Türkçe
    if source == "en" and target == "tr":

        for level, word_list in words.items():

            if not isinstance(word_list, list):
                continue

            for item in word_list:

                if not isinstance(item, dict):
                    continue

                word = str(
                    item.get("word", "")
                ).strip().lower()

                if word == clean_text:

                    return {
                        "translatedText": item.get(
                            "translation",
                            ""
                        ),
                        "meaning": item.get(
                            "meaning",
                            "Anlam bilgisi bulunamadı."
                        ),
                        "level": item.get(
                            "level",
                            level
                        ),
                        "example": item.get(
                            "example",
                            "-"
                        ),
                        "alternatives": item.get(
                            "alternatives",
                            "-"
                        )
                    }

    return None


# ==========================================
# ÇEVİRİ API
# ==========================================

@app.route("/translate", methods=["POST"])
def translate():

    data = request.get_json(silent=True)

    if not data:

        return jsonify({
            "error": "Veri gönderilmedi."
        }), 400


    text = str(
        data.get("q", "")
    ).strip()

    source = str(
        data.get("source", "tr")
    ).strip().lower()

    target = str(
        data.get("target", "en")
    ).strip().lower()


    if not text:

        return jsonify({
            "error": "Çevrilecek metin boş."
        }), 400


    print(
        f"Çeviri isteği: {source} → {target}: {text}"
    )


    # ======================================
    # KELİME VERİTABANINDA ARA
    # ======================================

    result = find_word(
        text,
        source,
        target
    )


    if result:

        print(
            "Kelime bulundu:",
            result["translatedText"]
        )

        return jsonify(result), 200


    # ======================================
    # BULUNAMADI
    # ======================================
    print("Gelen veri:", source, target, text)

    print(
        "Kelime bulunamadı:",
        text
    )

    return jsonify({

        "error":
            "Bu kelime henüz kelime veritabanında bulunmuyor.",

        "translatedText": ""

    }), 404


# ==========================================
# TEST ENDPOINT
# ==========================================

@app.route("/test", methods=["GET"])
def test():

    return jsonify({
        "status": "ok",
        "message": "LinguaLearn Python çeviri sunucusu çalışıyor.",
        "wordCount": count_words()
    })


# ==========================================
# KELİME SAYISI
# ==========================================

def count_words():

    total = 0

    for level, word_list in words.items():

        print(
            level,
            "→",
            len(word_list),
            "kelime"
        )

        if isinstance(word_list, list):
            total += len(word_list)

    return total


# ==========================================
# SUNUCU
# ==========================================

if __name__ == "__main__":

    print()
    print("==========================================")
    print("LinguaLearn Python Çeviri Sunucusu")
    print("==========================================")
    print(
        "Toplam kelime:",
        count_words()
    )
    print(
        "Sunucu: http://127.0.0.1:5000"
    )
    print("==========================================")
    print()

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )
