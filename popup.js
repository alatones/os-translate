const DEFAULT_LANG = "ja";
const DASHBOARD_HOST = "dashboard.onesignal.com";

// Pre-filled Google Form URL. Keep these in sync with the same constants
// in background.js. See the README for setup instructions.
const FEEDBACK_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdjpa5SWFW4M3nNOzNrJEZBUU_kCceYul-k5Xo3fo6qlv7yUw/viewform";
const FORM_ENTRY = {
  language: "entry.883413776",
  selected: "entry.1755271323",
};
const FORM_LANG_LABEL = {
  es: "Spanish",
  pt: "Portuguese (BR)",
  "zh-CN": "Simplified Chinese",
  ja: "Japanese",
  tr: "Turkish",
  ko: "Korean",
  fr: "French",
};

// Flag emojis for the language picker. Skipped for `en` (off mode).
// Note: these render as gray letter-pairs ("JP") on Windows 10, which
// has no native color-emoji font. macOS / Win11 / ChromeOS / Linux
// (with Noto fonts) render them in color.
const LANG_FLAGS = {
  es: "🇪🇸",
  pt: "🇧🇷",
  "zh-CN": "🇨🇳",
  ja: "🇯🇵",
  tr: "🇹🇷",
  ko: "🇰🇷",
  fr: "🇫🇷",
};

// Localized strings for the popup chrome itself. Keyed by string ID,
// then language code. The English text in popup.html is the fallback
// (kept inline for accessibility + en/off mode). Drives both static
// elements (via [data-i18n] attribute) and runtime status / confirm
// strings (via t()).
//
// "OneSignal Translator" the heading is intentionally not translated —
// it's the product name.
const POPUP_STRINGS = {
  language_label: {
    ja: "言語",
    es: "Idioma",
    pt: "Idioma",
    ko: "언어",
    fr: "Langue",
    tr: "Dil",
    "zh-CN": "语言",
  },
  optin_label: {
    ja: "翻訳の改善にご協力ください（匿名化された未翻訳の文字列を共有）",
    es: "Ayuda a mejorar las traducciones (compartir cadenas no traducidas anonimizadas)",
    pt: "Ajude a melhorar as traduções (compartilhar strings não traduzidas anonimizadas)",
    ko: "번역 개선에 도움 주기 (익명 처리된 미번역 문자열 공유)",
    fr: "Aidez à améliorer les traductions (partager les chaînes non traduites anonymisées)",
    tr: "Çevirileri iyileştirmeye yardım edin (anonim hale getirilmiş çevrilmemiş dizeler paylaşılır)",
    "zh-CN": "帮助改进翻译（共享匿名化的未翻译字符串）",
  },
  queue_link: {
    ja: "待機中のデータを確認 →",
    es: "Ver lo que está en cola →",
    pt: "Ver o que está na fila →",
    ko: "대기 중인 항목 보기 →",
    fr: "Voir ce qui est en file d'attente →",
    tr: "Kuyruktakileri görüntüle →",
    "zh-CN": "查看队列中的内容 →",
  },
  feedback_btn: {
    ja: "翻訳の問題を報告",
    es: "Reportar un problema de traducción",
    pt: "Relatar um problema de tradução",
    ko: "번역 문제 신고",
    fr: "Signaler un problème de traduction",
    tr: "Çeviri sorununu bildir",
    "zh-CN": "报告翻译问题",
  },
  hint: {
    ja: "ヒント：ダッシュボード上の翻訳されたテキストを右クリックすると、その文字列の修正を提案できます。",
    es: "Consejo: haz clic derecho en cualquier texto traducido del dashboard para sugerir una corrección para esa cadena específica.",
    pt: "Dica: clique com o botão direito em qualquer texto traduzido no dashboard para sugerir uma correção para essa string específica.",
    ko: "팁: 대시보드의 번역된 텍스트를 마우스 오른쪽 버튼으로 클릭하여 해당 문자열에 대한 수정을 제안하세요.",
    fr: "Astuce : faites un clic droit sur n'importe quel texte traduit du tableau de bord pour suggérer une correction pour cette chaîne spécifique.",
    tr: "İpucu: panodaki çevrilmiş herhangi bir metne sağ tıklayarak o belirli dize için düzeltme önerebilirsiniz.",
    "zh-CN": "提示：在仪表板上右键单击任何已翻译的文本，为该特定字符串提交修改建议。",
  },
  disclosure_body: {
    ja: "この拡張機能は、翻訳できていなかったダッシュボードの文字列リストを共有してカバレッジを改善します。URL、ユーザーID、個人データは送信されません。",
    es: "Esta extensión comparte una lista de cadenas del dashboard que no se tradujeron para mejorar la cobertura. No se envían URLs, IDs de usuario ni datos personales.",
    pt: "Esta extensão compartilha uma lista de strings do dashboard que não foram traduzidas para melhorar a cobertura. Não são enviados URLs, IDs de usuário nem dados pessoais.",
    ko: "이 확장 프로그램은 번역되지 않은 대시보드 문자열 목록을 공유하여 번역 범위를 개선합니다. URL, 사용자 ID, 개인정보는 전송되지 않습니다.",
    fr: "Cette extension partage une liste de chaînes du tableau de bord qui n'ont pas été traduites pour améliorer la couverture. Aucune URL, ID utilisateur ou donnée personnelle n'est envoyée.",
    tr: "Bu uzantı, kapsamı geliştirmek için çevrilmemiş pano dizelerinin bir listesini paylaşır. URL, kullanıcı kimliği veya kişisel veri gönderilmez.",
    "zh-CN": "此扩展会共享仪表板上未翻译的字符串列表以改进覆盖范围。不发送任何 URL、用户 ID 或个人数据。",
  },
  disclosure_dismiss: {
    ja: "了解",
    es: "Entendido",
    pt: "Entendi",
    ko: "확인",
    fr: "Compris",
    tr: "Anladım",
    "zh-CN": "知道了",
  },
  status_cancelled: {
    ja: "キャンセルしました。",
    es: "Cancelado.",
    pt: "Cancelado.",
    ko: "취소되었습니다.",
    fr: "Annulé.",
    tr: "İptal edildi.",
    "zh-CN": "已取消。",
  },
  status_saved: {
    ja: "保存しました。再読み込み中…",
    es: "Guardado. Recargando…",
    pt: "Salvo. Recarregando…",
    ko: "저장되었습니다. 다시 로드하는 중…",
    fr: "Enregistré. Rechargement…",
    tr: "Kaydedildi. Yeniden yükleniyor…",
    "zh-CN": "已保存。正在重新加载…",
  },
  status_no_form: {
    ja: "フィードバックフォームが設定されていません — READMEを参照してください。",
    es: "El formulario de comentarios no está configurado — consulta el README.",
    pt: "O formulário de feedback não está configurado — consulte o README.",
    ko: "피드백 양식이 구성되지 않았습니다 — README를 참조하세요.",
    fr: "Le formulaire de retour n'est pas configuré — voir le README.",
    tr: "Geri bildirim formu yapılandırılmadı — README'ye bakın.",
    "zh-CN": "反馈表单未配置 — 请参阅 README。",
  },
  confirm_reload: {
    ja: "言語を切り替えるとOneSignalダッシュボードのタブが再読み込みされます。保存されていない変更（下書き、開いているエディター）は失われます。\n\n今すぐ再読み込みしますか？",
    es: "Cambiar el idioma recargará la pestaña del dashboard de OneSignal. Cualquier cambio no guardado (borradores, editores abiertos) se perderá.\n\n¿Recargar ahora?",
    pt: "Mudar o idioma vai recarregar a aba do dashboard do OneSignal. Qualquer alteração não salva (rascunhos, editores abertos) será perdida.\n\nRecarregar agora?",
    ko: "언어를 변경하면 OneSignal 대시보드 탭이 다시 로드됩니다. 저장되지 않은 변경사항(초안, 열려 있는 편집기)은 손실됩니다.\n\n지금 다시 로드하시겠습니까?",
    fr: "Changer de langue rechargera l'onglet du tableau de bord OneSignal. Les modifications non enregistrées (brouillons, éditeurs ouverts) seront perdues.\n\nRecharger maintenant ?",
    tr: "Dili değiştirmek OneSignal pano sekmesini yeniden yükleyecektir. Kaydedilmemiş değişiklikler (taslaklar, açık editörler) kaybolacaktır.\n\nŞimdi yeniden yüklensin mi?",
    "zh-CN": "切换语言将重新加载 OneSignal 仪表板选项卡。任何未保存的更改（草稿、打开的编辑器）将丢失。\n\n立即重新加载？",
  },
};

// Active popup language — set after we read storage on load. Used by
// t() and applyPopupTranslations().
let popupLang = "en";

function t(key, fallback) {
  return POPUP_STRINGS[key]?.[popupLang] ?? fallback;
}

function applyPopupTranslations() {
  // Walk every [data-i18n] element and replace its textContent with the
  // localized string. The English fallback in popup.html stays in place
  // for `en` mode (and accessibility) because we only overwrite when
  // a localized variant exists.
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const localized = POPUP_STRINGS[key]?.[popupLang];
    if (localized) el.textContent = localized;
  });
}

const select = document.getElementById("lang");
const status = document.getElementById("status");
const feedbackBtn = document.getElementById("feedback");
const optinBox = document.getElementById("ledger-optin");
const queueLink = document.getElementById("queue-link");
const disclosure = document.getElementById("disclosure");
const disclosureDismiss = document.getElementById("disclosure-dismiss");

function setStatus(msg) {
  status.textContent = msg;
}

async function populateLanguageOptions() {
  // Load the language registry from languages.json so adding a new language
  // requires zero JS changes — just an entry in the "languages" map.
  try {
    const res = await fetch(chrome.runtime.getURL("languages.json"));
    const data = await res.json();
    const langs = (data && data.languages) || {};
    for (const [code, label] of Object.entries(langs)) {
      const opt = document.createElement("option");
      opt.value = code;
      const flag = LANG_FLAGS[code];
      opt.textContent = flag ? `${flag} ${label}` : label;
      select.appendChild(opt);
    }
  } catch (err) {
    console.warn("[OneSignal Translator] failed to load language list:", err);
  }
  const { language } = await chrome.storage.sync.get({ language: DEFAULT_LANG });
  select.value = language;
  popupLang = language;
  applyPopupTranslations();
}

populateLanguageOptions();

select.addEventListener("change", async () => {
  const next = select.value;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const onDashboard = tab && tab.url && tab.url.includes(DASHBOARD_HOST);

  // Warn before reloading — the user may have unsaved edits in a draft
  // message, segment builder, etc. Confirming here is cheap; losing work
  // is not. Show the prompt in whichever language is currently active
  // (the language they're switching FROM), since that's what the user
  // can read right now.
  const ok = onDashboard
    ? confirm(
        t(
          "confirm_reload",
          "Switching language will reload the OneSignal dashboard tab. " +
            "Any unsaved changes (drafts, open editors) will be lost.\n\n" +
            "Reload now?",
        ),
      )
    : true;

  if (!ok) {
    // Restore the dropdown to whatever was saved — don't persist the change.
    chrome.storage.sync.get({ language: DEFAULT_LANG }, ({ language }) => {
      select.value = language;
    });
    setStatus(t("status_cancelled", "Cancelled."));
    return;
  }

  chrome.storage.sync.set({ language: next }, () => {
    // Use the NEW language for the "saved" message — it's the language
    // the user just picked, and the popup is about to be irrelevant
    // anyway (tab reloads in a moment).
    popupLang = next;
    setStatus(t("status_saved", "Saved. Reloading…"));
    if (onDashboard) chrome.tabs.reload(tab.id);
  });
});

chrome.storage.sync.get(
  { ledgerOptIn: true, ledgerDisclosureSeen: false },
  ({ ledgerOptIn, ledgerDisclosureSeen }) => {
    optinBox.checked = !!ledgerOptIn;
    if (!ledgerDisclosureSeen) disclosure.style.display = "block";
  },
);

optinBox.addEventListener("change", () => {
  chrome.storage.sync.set({ ledgerOptIn: optinBox.checked });
});

disclosureDismiss.addEventListener("click", () => {
  disclosure.style.display = "none";
  chrome.storage.sync.set({ ledgerDisclosureSeen: true });
});

queueLink.addEventListener("click", (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: chrome.runtime.getURL("queue.html") });
});

feedbackBtn.addEventListener("click", async () => {
  if (!FEEDBACK_FORM_URL) {
    setStatus(t("status_no_form", "Feedback form not configured — see README."));
    return;
  }
  const { language = DEFAULT_LANG } = await chrome.storage.sync.get({ language: DEFAULT_LANG });
  const params = new URLSearchParams({ usp: "pp_url" });
  const langLabel = FORM_LANG_LABEL[language];
  if (langLabel) params.set(FORM_ENTRY.language, langLabel);
  chrome.tabs.create({ url: `${FEEDBACK_FORM_URL}?${params.toString()}` });
});
