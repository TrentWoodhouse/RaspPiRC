export let randomList = [
    'Agar.io Cell',
    'Bathing Bird',
    'cAPS lOCK gUY',
    'Casey\'s Breakfast Pizza',
    'Cereal Milk',
    'Chevy Bel Air Hot Wheel',
    'Crewmate',
    'Duct Tape',
    'Duck Tape',
    'Y-Strap Adjustment Chiropractor',
    'Corona Virus',
    'Food Pyramid Worshiper',
    'Hand Sanitizer',
    'Hand De-Sanitizer',
    'Harry Potter Geek',
    'Harvest Baptist Church Parishioner',
    'Head-Massaging Indian Man',
    'Impostor',
    'It-Works!® Independent Business-Owner',
    'JB Haircut',
    'Kibbles',
    'Medium-Rare Chicken',
    'Oreo Fluff',
    'Over-Talkative Band Kid',
    'PAM Cooking Spray',
    'Rainbow Keyboard',
    'Road Rager',
    'Selfie Stick',
    'B- College Student',
    'Sous Vide Steak',
    'Spicy Tuna Roll',
    'Stir Fry',
    'Stubbed Toe',
    'Triple Bean Burrito',
    'Ultra Instinct Shaggy',
    'Vegan Bean Burger',
    'WD-40',
    'Website Cookie',
    'Wizard',
    '10-ft Charging Cord',
    '$2 Bill',
]

export default function randomWord() {
    return randomList[Math.floor(Math.random() * randomList.length)]
}
