
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
    { id: 1, name: 'Diện mạo khói', icon: '🚬' },
    { id: 2, name: 'Cạm bẫy hơi', icon: '🌬️' },
    { id: 3, name: 'Ma trận độc', icon: '🧪' },
    { id: 4, name: 'Xiềng xích Nicotine', icon: '⛓️' },
    { id: 5, name: 'Vết sẹo sức khỏe', icon: '☣️' },
    { id: 6, name: 'Tội ác môi trường', icon: '🌍' },
    { id: 7, name: 'Kỷ cương thép', icon: '🔨' },
    { id: 8, name: 'Luật thép ngăn chặn', icon: '⚖️' },
    { id: 9, name: 'Bản lĩnh đối diện', icon: '🛡️' },
    { id: 10, name: 'Tương lai không thuốc lá', icon: '🚭' },
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
        question: 'Khác với việc đốt cháy lá thuốc, các thiết bị thuốc lá nung nóng (HTPs) hoạt động dựa trên cơ chế nào?',
        options: [
            'Đốt cháy sợi thuốc ở 1000°C.',
            'Nung nóng sợi thuốc ở nhiệt độ khoảng 350°C.',
            'Chỉ sử dụng hơi nước sạch để tạo mùi.',
            'Làm đông lạnh sợi thuốc để tạo khói.'
        ],
        answer: 'Nung nóng sợi thuốc ở nhiệt độ khoảng 350°C.'
    },
    {
        id: 'q3',
        type: 'mcq',
        question: 'Bản chất thực sự của làn khói tỏa ra từ các thiết bị thuốc lá thế hệ mới (Vape, Pod) là gì?',
        options: [
            'Hơi nước tinh khiết không chứa hóa chất.',
            'Không khí có mùi trái cây giúp tỉnh táo.',
            'Hỗn hợp "sol khí" chứa Nicotine và hóa chất độc hại.',
            'Tinh dầu tự nhiên giúp làm sạch phổi.'
        ],
        answer: 'Hỗn hợp "sol khí" chứa Nicotine và hóa chất độc hại.'
    },
    {
        id: 'q4',
        type: 'mcq',
        question: 'Nicotine trong thuốc lá điện tử tấn công và "khóa chặt" các thụ thể não bộ để gây nghiện chỉ sau bao nhiêu giây?',
        options: ['3 – 5 giây', '7 – 10 giây', '20 – 30 giây', '60 giây'],
        answer: '7 – 10 giây'
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
        question: 'Tại sao rác thải từ các thiết bị thuốc lá điện tử (đặc biệt là Pod) lại gây ô nhiễm nguồn nước vĩnh viễn?',
        options: [
            'Vì chúng có màu sắc sặc sỡ thu hút cá.',
            'Vì pin Lithium và vi mạch phát tán kim loại nặng kịch độc.',
            'Vì vỏ máy làm từ nhựa không tái chế.',
            'Vì tinh dầu có chứa nhiều dầu thực vật.'
        ],
        answer: 'Vì pin Lithium và vi mạch phát tán kim loại nặng kịch độc.'
    },
    {
        id: 'q7',
        type: 'mcq',
        question: 'Theo Luật Phòng, chống tác hại của thuốc lá năm 2012, địa điểm nào sau đây bị CẤM hút thuốc lá hoàn toàn trong nhà và trong phạm vi khuôn viên?',
        options: [
            'Sân vận động mở.',
            'Công viên rộng lớn.',
            'Vỉa hè đường phố.',
            'Trường học và các cơ sở y tế.'
        ],
        answer: 'Trường học và các cơ sở y tế.'
    },
    {
        id: 'q8',
        type: 'mcq',
        question: 'Theo quy định nghiêm minh tại Điều 26 về việc xử phạt thuốc lá thế hệ mới, biện pháp khắc phục hậu quả bắt buộc đối với hành vi sử dụng thuốc lá điện tử, thuốc lá nung nóng là gì?',
        options: [
            'Phạt lao động công ích tại địa phương.',
            'Buộc tiêu hủy thuốc lá điện tử, thuốc lá nung nóng vi phạm.',
            'Đình chỉ các hoạt động vui chơi, giải trí trong 01 tháng.',
            'Tịch thu điện thoại và các thiết bị điện tử cá nhân của người vi phạm.'
        ],
        answer: 'Buộc tiêu hủy thuốc lá điện tử, thuốc lá nung nóng vi phạm.'
    },
    {
        id: 'q9',
        type: 'mcq',
        question: 'Đâu là nguyên tắc cốt lõi trong kỹ năng từ chối để thoát khỏi ma trận dụ dỗ của bạn bè?',
        options: [
            'Nói "KHÔNG" dứt khoát, đưa ra lý do cá nhân và rời đi.',
            'Cố gắng giải thích để bạn mình hiểu tác hại.',
            'Thử một hơi để làm hài lòng bạn rồi mới từ chối.',
            'Im lặng bỏ đi mà không nói lời nào.'
        ],
        answer: 'Nói "KHÔNG" dứt khoát, đưa ra lý do cá nhân và rời đi.'
    },
    {
        id: 'q10',
        type: 'mcq',
        question: 'Trong hành trình xây dựng bản lĩnh Alpha, tại sao việc quyết định "Nói KHÔNG" với thuốc lá lại là chiến thắng cao nhất của một người trẻ?',
        options: [
            'Vì giúp tiết kiệm được một khoản tài chính lớn.',
            'Vì không còn lo lắng về các quy định xử phạt.',
            'Vì đó là cách khẳng định giá trị bản thân, bảo vệ danh dự và không để làn khói điều khiển cuộc đời mình.',
            'Vì giúp nhận được sự khen ngợi từ gia đình và nhà trường.'
        ],
        answer: 'Vì đó là cách khẳng định giá trị bản thân, bảo vệ danh dự và không để làn khói điều khiển cuộc đời mình.'
    }
];

// Return questions in fixed stage order
export const getRandomQuestions = (): Question[] => {
    return [...QUESTIONS];
};

