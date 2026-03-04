
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

export const READING_PASSAGE = `APPS OF THE FUTURE

How many times a day do you tap the icon of your favourite social media site or play a game on your smartphone? When your parents were young, apps didn't even exist, but now we can't imagine our lives without them. So what will apps be like in the future?

A new way to learn
Apps are being used in education. They are useful because students can use them anytime, anywhere and on any device. They present information in bite-sized chunks, which people find easy to understand and remember. Lessons can also be turned into games, making learning fun! Soon, apps will be the new normal.

Augmented Reality (AR)
Inside AR apps, the real world is mixed with the digital one. These apps are downloaded and teachers use them to make learning more interesting. These apps capture students' attention and help them concentrate and interact with their lessons. Students can experience the material and become more interested in the subject. At the same time, they can explore the topic taught at their own pace.

In the future, apps will be able to do a lot of things for us. Some people think this will have a lot of benefits, others think it will make us lazy or that we will forget how to do things for ourselves. Whatever your opinion on modern technology, one thing is certain: the apps of the future will change our lives.`;

export const STAGES: Stage[] = [
    { id: 1, name: 'Launch', icon: '\u{1F680}' },
    { id: 2, name: 'Explore', icon: '\u{1F30D}' },
    { id: 3, name: 'Power-Up', icon: '\u{1F3AE}' },
    { id: 4, name: 'Unlock', icon: '\u{1F9E9}' },
    { id: 5, name: 'Focus Mode', icon: '\u{1F3AF}' },
    { id: 6, name: 'Upgrade', icon: '\u{1F9E0}' },
    { id: 7, name: 'Challenge', icon: '\u2696\uFE0F' },
    { id: 8, name: 'Final Boss', icon: '\u{1F3C6}' },
];

export const QUESTIONS: Question[] = [
    // Stage 1 - TFD (Doesn't say)
    {
        id: 'q1',
        type: 'tfd',
        question: 'The first apps appeared over 50 years ago.',
        options: ['True', 'False', "Doesn't say"],
        answer: "Doesn't say"
    },
    // Stage 2 - TFD (False)
    {
        id: 'q2',
        type: 'tfd',
        question: 'You can only use educational apps on smartphones.',
        options: ['True', 'False', "Doesn't say"],
        answer: 'False'
    },
    // Stage 3 - MCQ
    {
        id: 'q3',
        type: 'mcq',
        question: 'How do educational apps present information?',
        options: [
            'In long academic texts',
            'Through live video lessons',
            'In bite-sized chunks',
            'In printed worksheets'
        ],
        answer: 'In bite-sized chunks'
    },
    // Stage 4 - TFD (True)
    {
        id: 'q4',
        type: 'tfd',
        question: 'Some apps already use augmented reality.',
        options: ['True', 'False', "Doesn't say"],
        answer: 'True'
    },
    // Stage 5 - TFD (False)
    {
        id: 'q5',
        type: 'tfd',
        question: 'AR apps make lessons boring.',
        options: ['True', 'False', "Doesn't say"],
        answer: 'False'
    },
    // Stage 6 - TFD (False)
    {
        id: 'q6',
        type: 'tfd',
        question: 'Everyone believes apps will make us lazy.',
        options: ['True', 'False', "Doesn't say"],
        answer: 'False'
    },
    // Stage 7 - MCQ
    {
        id: 'q7',
        type: 'mcq',
        question: 'According to the text, what is certain about the apps of the future?',
        options: [
            'They will completely replace teachers.',
            'They will disappear in the future.',
            'They will change our lives.',
            'They will be used only for education.'
        ],
        answer: 'They will change our lives.'
    },
    // Stage 8 - MCQ
    {
        id: 'q8',
        type: 'mcq',
        question: 'The author\'s purpose is to …',
        options: [
            'give us information about how apps are developing.',
            'explain predictions about future technology in education.',
            'inform us how to use the apps more efficiently.',
            'give us tips on choosing apps.'
        ],
        answer: 'give us information about how apps are developing.'
    }
];

// Return questions in fixed stage order
export const getRandomQuestions = (): Question[] => {
    return [...QUESTIONS];
};

