export const translations = {
  en: {
    // Splash Screen
    splash: {
      getStarted: "Get Started",
    },
    // Header
    header: {
      searchPlaceholder: "Search notes...",
    },
    // Note Editor
    noteEditor: {
      newNote: "New Note",
      editNote: "Edit Note",
      titlePlaceholder: "Title",
      contentPlaceholder: "Enter note content...",
    },
    // Settings
    settings: {
      title: "Settings",
      importNotes: "Import Notes",
      importNotesDesc: "Import notes from JSON file",
      exportNotes: "Export Notes",
      exportNotesDesc: "Export all notes as JSON file",
      clearData: "Clear All Data",
      clearDataDesc: "Reset app and delete all notes permanently",
      language: "Language",
      languageDesc: "Change app language",
      english: "English",
      japanese: "Japanese",
    },
    // Alerts
    alerts: {
      deleteNoteTitle: "Delete Note",
      deleteNoteMessage:
        "Are you sure you want to delete this note? This action cannot be undone.",
      clearDataTitle: "Clear All Data",
      clearDataMessage:
        "Are you sure you want to permanently delete all notes? This action is irreversible and cannot be undone. All your notes will be lost forever.",
      cancel: "Cancel",
      delete: "Delete",
      clearData: "Clear All Data",
      importNotesTitle: "Import Notes",
      importNotesMessage: (count: number) =>
        `Found ${count} note(s). Do you want to replace all existing notes or merge them (overwriting notes with matching IDs)?`,
      replace: "Replace",
      merge: "Merge",
      success: "Success",
      imported: (count: number) => `Imported ${count} note(s).`,
      updated: (count: number) => `Updated ${count} note(s).`,
      added: (count: number) => `Added ${count} new note(s).`,
      updatedAndAdded: (updated: number, added: number) =>
        `Updated ${updated} note(s) and added ${added} new note(s).`,
      error: "Error",
      invalidFileFormat: "Invalid file format. Expected an array of notes.",
      noValidNotes: "No valid notes found in the file.",
      importFailed: "Failed to import notes. Please check the file format.",
      exportFailed: "Failed to export notes",
      sharingNotAvailable: "Sharing is not available on this device",
    },
    // Note Card
    noteCard: {
      untitled: "Untitled",
      pin: "Pin",
      unpin: "Unpin",
      delete: "Delete",
    },
    // Sections
    sections: {
      pinned: "Pinned",
      today: "Today",
      yesterday: "Yesterday",
      previous7Days: "Previous 7 Days",
      previous30Days: "Previous 30 Days",
    },
  },
  ja: {
    // Splash Screen
    splash: {
      getStarted: "始める",
    },
    // Header
    header: {
      searchPlaceholder: "ノートを検索...",
    },
    // Note Editor
    noteEditor: {
      newNote: "新しいノート",
      editNote: "ノートを編集",
      titlePlaceholder: "名前",
      contentPlaceholder: "ノートの内容を入力してください...",
    },
    // Settings
    settings: {
      title: "設定",
      importNotes: "ノートをインポート",
      importNotesDesc: "JSONファイルからノートをインポート",
      exportNotes: "ノートをエクスポート",
      exportNotesDesc: "すべてのノートをJSONファイルとしてエクスポート",
      clearData: "データをクリア",
      clearDataDesc: "アプリをリセットしてすべてのノートを完全に削除",
      language: "言語",
      languageDesc: "アプリの言語を変更",
      english: "英語",
      japanese: "日本語",
    },
    // Alerts
    alerts: {
      deleteNoteTitle: "ノートを削除",
      deleteNoteMessage:
        "本当にこのノートを削除しますか？この操作は元に戻すことができません。",
      clearDataTitle: "データをクリア",
      clearDataMessage:
        "本当にすべてのノートを完全に削除しますか？この操作は元に戻すことができません。すべてのノートが永遠に失われます。",
      cancel: "キャンセル",
      delete: "削除",
      clearData: "データをクリア",
      importNotesTitle: "ノートをインポート",
      importNotesMessage: (count: number) =>
        `${count}件のノートが見つかりました。既存のノートをすべて置き換えますか、それともマージしますか（一致するIDのノートを上書き）？`,
      replace: "置き換え",
      merge: "マージ",
      success: "成功",
      imported: (count: number) => `${count}件のノートをインポートしました。`,
      updated: (count: number) => `${count}件のノートを更新しました。`,
      added: (count: number) => `${count}件の新しいノートを追加しました。`,
      updatedAndAdded: (updated: number, added: number) =>
        `${updated}件のノートを更新し、${added}件の新しいノートを追加しました。`,
      error: "エラー",
      invalidFileFormat: "無効なファイル形式です。ノートの配列が必要です。",
      noValidNotes: "ファイルに有効なノートが見つかりませんでした。",
      importFailed: "ノートのインポートに失敗しました。ファイル形式を確認してください。",
      exportFailed: "ノートのエクスポートに失敗しました",
      sharingNotAvailable: "このデバイスでは共有機能が利用できません",
    },
    // Note Card
    noteCard: {
      untitled: "無題",
      pin: "ピン留め",
      unpin: "ピン留め解除",
      delete: "削除",
    },
    // Sections
    sections: {
      pinned: "ピン留め",
      today: "今日",
      yesterday: "昨日",
      previous7Days: "過去7日間",
      previous30Days: "過去30日間",
    },
  },
};

export type Language = "en" | "ja";
export type TranslationKey = keyof typeof translations.en;

