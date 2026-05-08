
export interface Question {
    id: string;
    type: 'mcq' | 'tfd';
    question: string;
    options?: string[];
    answer: string;
}

export interface Stage {
    id: number;
    name: string;
    icon: string;
}

export const READING_PASSAGE = `⚡ 1. Vượt qua 10 chặng thử thách, phá tan ma trận làn khói ảo!

🛡️ 2. Kích hoạt bản lĩnh thép, kiên quyết nói "KHÔNG" để làm chủ tương lai!`;

export const STAGES: Stage[] = [
    { id: 1, name: 'Chặng 1', icon: '🚀' },
    { id: 2, name: 'Chặng 2', icon: '🌍' },
    { id: 3, name: 'Chặng 3', icon: '🎮' },
    { id: 4, name: 'Chặng 4', icon: '🧩' },
    { id: 5, name: 'Chặng 5', icon: '🎯' },
    { id: 6, name: 'Chặng 6', icon: '🧠' },
    { id: 7, name: 'Chặng 7', icon: '⚖️' },
    { id: 8, name: 'Chặng 8', icon: '🏆' },
    { id: 9, name: 'Chặng 9', icon: '🔥' },
    { id: 10, name: 'Chặng 10', icon: '⭐' },
];

export const QUESTIONS: Question[] = [
    {
        id: 'q1',
        type: 'mcq',
        question: 'Tỷ lệ học sinh 13–17 tuổi tại Việt Nam dùng thuốc lá điện tử đã tăng vọt lên mức bao nhiêu vào năm 2023?',
        options: ['2,6%', '5,5%', '8,1%', '12,0%'],
        answer: '8,1%'
    },
    {
        id: 'q2',
        type: 'mcq',
        question: 'Chọn phát biểu sai về 3 loại thuốc lá: truyền thống, điện tử và nung nóng.',
        options: [
            'Đều chứa các chất độc hại.',
            'Đều chứa nguyên liệu thuốc lá tự nhiên.',
            'Đều có mùi hương.',
            'Đều sử dụng dụng cụ đi kèm.'
        ],
        answer: 'Đều chứa nguyên liệu thuốc lá tự nhiên.'
    },
    {
        id: 'q3',
        type: 'mcq',
        question: 'Nhiều bạn trẻ lầm tưởng khói thuốc lá điện tử là "hơi nước sạch". Sự thật làn khói này là gì?',
        options: [
            'Hơi nước tinh khiết 100%.',
            'Không khí có mùi trái cây.',
            'Hỗn hợp "sol khí" chứa Nicotine và hóa chất độc hại.',
            'Tinh dầu giúp làm sạch phổi.'
        ],
        answer: 'Hỗn hợp "sol khí" chứa Nicotine và hóa chất độc hại.'
    },
    {
        id: 'q4',
        type: 'mcq',
        question: 'Nicotine trong thuốc lá thế hệ mới tấn công não bộ để gây nghiện chỉ sau bao nhiêu giây?',
        options: ['3 giây.', '10 giây.', '30 giây.', '60 giây.'],
        answer: '10 giây.'
    },
    {
        id: 'q5',
        type: 'mcq',
        question: 'Hóa chất Formaldehyde trong khói thuốc gây ra tổn thương nguy hiểm nào sau đây?',
        options: [
            'Làm da bị khô.',
            'Gây buồn ngủ nhẹ.',
            'Đứt gãy cấu trúc ADN và hình thành khối u.',
            'Chỉ làm vàng răng.'
        ],
        answer: 'Đứt gãy cấu trúc ADN và hình thành khối u.'
    },
    {
        id: 'q6',
        type: 'mcq',
        question: 'Tại sao rác thải từ Pod dùng một lần lại gây "khủng hoảng mới" cho môi trường?',
        options: [
            'Vì chúng làm từ giấy dễ cháy.',
            'Vì pin Lithium và vi mạch phát tán kim loại nặng kịch độc.',
            'Vì chúng thu hút côn trùng.',
            'Vì chúng quá nhẹ nên dễ bay mất.'
        ],
        answer: 'Vì pin Lithium và vi mạch phát tán kim loại nặng kịch độc.'
    },
    {
        id: 'q7',
        type: 'mcq',
        question: 'Theo Nghị định 90/2026/NĐ-CP, hành vi nào sẽ bị xử phạt nặng từ 5 - 10 triệu đồng?',
        options: [
            'Tìm hiểu về vape trên mạng.',
            'Chứa chấp người khác sử dụng thuốc lá điện tử.',
            'Mua kẹo ngọt có vị trái cây.',
            'Đi ngang qua người đang hút vape.'
        ],
        answer: 'Chứa chấp người khác sử dụng thuốc lá điện tử.'
    },
    {
        id: 'q8',
        type: 'mcq',
        question: 'Địa điểm nào sau đây bị CẤM hút thuốc lá hoàn toàn theo quy định pháp luật?',
        options: [
            'Sân vận động mở.',
            'Công viên rộng lớn.',
            'Vỉa hè đường phố.',
            'Trường học và các cơ sở y tế.'
        ],
        answer: 'Trường học và các cơ sở y tế.'
    },
    {
        id: 'q9',
        type: 'mcq',
        question: 'Khi bị bạn bè rủ rê thử "vape sành điệu", bước đầu tiên của kỹ năng từ chối là gì?',
        options: [
            'Nói "KHÔNG" dứt khoát, không mơ hồ.',
            'Giải thích dài dòng về tác hại.',
            'Thử một lần rồi mới từ chối.',
            'Im lặng để bạn tự hiểu.'
        ],
        answer: 'Nói "KHÔNG" dứt khoát, không mơ hồ.'
    },
    {
        id: 'q10',
        type: 'mcq',
        question: 'Tác hại thường gặp khi hút thuốc lá lâu dài là gì?',
        options: [
            'Cải thiện trí nhớ.',
            'Gây nghiện nhẹ nhưng không ảnh hưởng sức khỏe.',
            'Bệnh phổi tắc nghẽn mãn tính và ung thư phổi.',
            'Giúp giảm cân an toàn.'
        ],
        answer: 'Bệnh phổi tắc nghẽn mãn tính và ung thư phổi.'
    }
];

// Return questions in fixed stage order
export const getRandomQuestions = (): Question[] => {
    return [...QUESTIONS];
};

