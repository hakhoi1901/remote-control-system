export let isShiftPending = false;

// Bảng dịch mã phím C# (.NET Keys Enum) sang ký tự thực tế
export const KEY_MAPPING = {
    // Hàng phím số (nếu Agent gửi D0-D9)
    'D0': '0', 'D1': '1', 'D2': '2', 'D3': '3', 'D4': '4',
    'D5': '5', 'D6': '6', 'D7': '7', 'D8': '8', 'D9': '9',

    // Các phím dấu câu cơ bản
    'Oemcomma': ',', 
    'OemPeriod': '.', 
    'OemQuestion': '/', 
    'OemMinus': '-', 
    'Oemplus': '=',
    'Oem1': ';',      // Dấu chấm phẩy
    'Oem7': "'",      // Dấu nháy đơn
    'OemOpenBrackets': '[', 
    'Oem6': ']', 
    'Oem5': '\\',     // Dấu gạch chéo ngược
    'Oem3': '`',      // Dấu huyền (cạnh số 1)
    
    // NumPad (Bàn phím số bên phải)
    'NumPad0': '0', 'NumPad1': '1', 'NumPad2': '2', 'NumPad3': '3', 'NumPad4': '4',
    'NumPad5': '5', 'NumPad6': '6', 'NumPad7': '7', 'NumPad8': '8', 'NumPad9': '9',
    'Decimal': '.', 'Add': '+', 'Subtract': '-', 'Multiply': '*', 'Divide': '/',
    'OemPipe': '\\', 'Oem4': '[', 'OemSemicolon': ';', 'Oem2': '/', 'Enter': '\n'
};

// Bảng Map ký tự khi giữ Shift (Shift + Key = NewKey)
export const SHIFT_SYMBOL_MAP = {
    '1': '!', '2': '@', '3': '#', '4': '$', '5': '%', '6': '^', '7': '&', '8': '*', '9': '(', '0': ')',
    '`': '~',
    '-': '_', '=': '+',
    '[': '{', ']': '}', '\\': '|',
    ';': ':', "'": '"',
    ',': '<', '.': '>', '/': '?'
};

// Bảng Telex và Dấu thanh (Giữ nguyên)
export const TELEX_MAP = {
    'aa': 'â', 'aw': 'ă', 'ee': 'ê', 'oo': 'ô', 'ow': 'ơ', 'dd': 'đ', 'uw': 'ư',
    's': '\u0301', 'f': '\u0300', 'r': '\u0309', 'x': '\u0303', 'j': '\u0323'
};
export const TONE_MAP = { 's': 0, 'f': 1, 'r': 2, 'x': 3, 'j': 4 };
export const VOWELS = {
    'a': 'áàảãạ', 'ă': 'ắằẳẵặ', 'â': 'ấầẩẫậ', 'e': 'éèẻẽẹ', 'ê': 'ếềểễệ',
    'i': 'íìỉĩị', 'o': 'óòỏõọ', 'ô': 'ốồổỗộ', 'ơ': 'ớờởỡợ', 'u': 'úùủũụ', 'ư': 'ứừửữự', 'y': 'ýỳỷỹỵ'
};

export function addTone(char, toneIndex) {
    const base = Object.keys(VOWELS).find(k => VOWELS[k].includes(char) || k === char);
    if (!base) return char;
    return VOWELS[base][toneIndex];
}

export function processInputKey(currentText, rawKey, mode) {
    // Bước 1: Làm sạch mã phím (Xóa ngoặc vuông nếu có)
    // Ví dụ: "[OemComma]" -> "OemComma"
    let cleanKey = rawKey;
    if (rawKey.startsWith('[') && rawKey.endsWith(']')) {
        cleanKey = rawKey.slice(1, -1);
    }

    // --- XỬ LÝ SHIFT ---
    // Nếu nhận được phím Shift, bật cờ và không in gì cả
    if (cleanKey === 'SHIFT' || cleanKey === 'Shift' || cleanKey === 'LShiftKey' || cleanKey === 'RShiftKey') {
        isShiftPending = true;
        return currentText;
    }

    // Bước 2: Kiểm tra xem có trong bảng Mapping không
    // Nếu có (ví dụ OemComma), đổi thành ","
    if (KEY_MAPPING[cleanKey]) {
        cleanKey = KEY_MAPPING[cleanKey];
    } 
    // Nếu không có trong map nhưng vẫn còn ngoặc vuông (ví dụ [CTRL], [SHIFT])
    // -> Đây là phím chức năng thật, bỏ qua không in.
    else if (rawKey.startsWith('[') && rawKey.endsWith(']')) {
        // Xử lý đặc biệt cho các phím chức năng muốn giữ lại hành vi
        if (cleanKey === 'Space' || cleanKey === 'SPACE') return currentText + ' ';
        if (cleanKey === 'Enter' || cleanKey === 'ENTER') return currentText + '\n';
        if (cleanKey === 'Tab' || cleanKey === 'TAB') return currentText + '\t';
        if (cleanKey === 'Back' || cleanKey === 'BACK') return currentText.slice(0, -1);
        
        // Các phím Shift, Ctrl, Alt... thì bỏ qua
        return currentText;
    }

    // --- ĐẾN ĐÂY LÀ CHẮC CHẮN KÝ TỰ IN ĐƯỢC (Chữ, Số, Dấu) ---

    // --- ÁP DỤNG SHIFT NẾU CÓ ---
    if (isShiftPending) {
        // Nếu là ký tự đặc biệt (số, dấu) -> Map sang ký tự Shift tương ứng
        if (SHIFT_SYMBOL_MAP[cleanKey]) {
            cleanKey = SHIFT_SYMBOL_MAP[cleanKey];
        } 
        // Nếu là chữ cái -> Viết hoa (Phòng hờ nếu C# gửi chữ thường)
        else if (cleanKey.length === 1) {
            cleanKey = cleanKey.toUpperCase();
        }
        
        // Tắt cờ Shift sau khi đã áp dụng cho 1 ký tự
        isShiftPending = false;
    }

    // Nếu không bật Telex -> Cộng thẳng vào
    if (mode !== 'telex') return currentText + cleanKey;

    // --- LOGIC TELEX ---
    if (currentText.length === 0) return currentText + cleanKey;
    
    const lastChar = currentText.slice(-1);
    const preText = currentText.slice(0, -1);
    const keyLower = cleanKey.toLowerCase();
    const pair = (lastChar + keyLower).toLowerCase();

    // Xử lý aa, ee, oo...
    if (TELEX_MAP[pair]) {
        let rep = TELEX_MAP[pair];
        if (lastChar === lastChar.toUpperCase()) rep = rep.toUpperCase();
        return preText + rep;
    }

    // Xử lý dấu thanh (s,f,r,x,j)
    if (TONE_MAP.hasOwnProperty(keyLower)) {
        // Tách từ cuối cùng ra để bỏ dấu
        // Regex tìm từ cuối cùng (các ký tự chữ cái)
        const match = currentText.match(/([a-zA-Z\u00C0-\u1EF9]+)$/);
        
        if (match) {
            let lastWord = match[0];
            let prefix = currentText.substring(0, match.index);
            
            // Quét ngược tìm nguyên âm để bỏ dấu
            for (let i = lastWord.length - 1; i >= 0; i--) {
                const char = lastWord[i].toLowerCase();
                // Tìm ký tự gốc (bỏ dấu cũ nếu có)
                const baseVowel = Object.keys(VOWELS).find(k => k === char || VOWELS[k].includes(char));
                
                if (baseVowel) {
                    let newChar = addTone(baseVowel, TONE_MAP[keyLower]);
                    if (lastWord[i] === lastWord[i].toUpperCase()) newChar = newChar.toUpperCase();
                    
                    const newWord = lastWord.substring(0, i) + newChar + lastWord.substring(i + 1);
                    return prefix + newWord;
                }
            }
        }
    }

    // Không phải quy tắc telex nào -> Cộng bình thường
    return currentText + cleanKey;
}