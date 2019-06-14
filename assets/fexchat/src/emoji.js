// import flags from '../emojis/flags.json';
// smiley_and_people.map(e => createImg(e_smiley_and_people, e));
// animal_and_nature.map(e => createImg(e_animal_and_nature, e));
// food_and_drink.map(e => createImg(e_food_and_drink, e));
// activities.map(e => createImg(e_activities, e));
// travel_and_places.map(e => createImg(e_travel_and_places, e));
// objects.map(e => createImg(e_objects, e));
// symbols.map(e => createImg(e_symbols, e));
var lastFocused;
on('focus',_$('#editor'),function(){
    lastFocused = document.activeElement;
});
/* 
* Load Emoji from the JSON files 
*/
const e_recent = _$('#e-recent'),
    e_smiley_and_people = _$('#e-smiley_and_people'),
    e_animal_and_nature = _$('#e-animal_and_nature'),
    e_food_and_drink = _$('#e-food_and_drink'),
    e_activities = _$('#e-activites'),
    e_travel_and_places = _$('#e-travel_and_places'),
    e_objects = _$('#e-objects'),
    e_symbols = _$('#e-symbols'),
    e_flags = _$('#e-flags'),
    e_skin_tones = _$('#e-skin-tones'),

    /* 
    *   Emoji Categories Pattern 
    */
    emoji_categories = {
        flags: /:fl[0-9]*:/,
        smiley_and_people: /:sp[0-9]*:/,
        animal_and_nature: /:an[0-9]*:/,
        food_and_drink: /:fd[0-9]*:/,
        activities: /:ac[0-9]*:/,
        travel_and_places: /:tp[0-9]*:/,
        objects: /:ob[0-9]*:/,
        symbols: /:sy[0-9]*:/
    },

    /* 
    *Create Emoji
    */
    createImg = (a,e) => {

        let img = document.createElement('img');
        img.srcset = `/assets/fexchat/emojis/images/${e.image}`;
        img.width = 32;
        img.height = 32;
        img.dataset.pattern = e.pattern;
        img.alt = `${e.name === 'null' ? e.short_name : e.name}`;
        a.appendChild(img);
    
    },
    
    /* 
    *Insert Emoji into Input box.
    *Find the LastFocused which is the input box.
    *and find the last cursor focus position with the help
    *selectionStart and selectionEnd inputs Methods.
    */
    insertEmoji = function (e) {

        var pattern = this.dataset.pattern;
        input = lastFocused;

        if (input == undefined) { 
            _$('#editor').value += ` ${pattern} `;
            return; 
        }
        var scrollPos = input.scrollTop,
        pos = 0;
        pos = input.selectionStart;

        var front = (input.value).substring(0, pos),
        back = (input.value).substring(pos, input.value.length);
        input.value = `${front} ${pattern} ${back}`;
        pos = pos + pattern.length + 2;
        input.selectionStart = pos;
        input.selectionEnd = pos;
        input.focus();
        input.scrollTop = scrollPos;
        emojiToggle();
    };


/* 
*Insert Emojis into the DOM.
*/
flags.map(e => createImg(e_flags,e));
smiley_and_people.map(e => createImg(e_smiley_and_people,e));
animal_and_nature.map(e => createImg(e_animal_and_nature,e));
food_and_drink.map(e => createImg(e_food_and_drink,e));
activities.map(e => createImg(e_activities,e));
travel_and_places.map(e => createImg(e_travel_and_places,e));
objects.map(e => createImg(e_objects,e));
symbols.map(e => createImg(e_symbols,e));

on('click',_$('.emoji-body>div img',true),insertEmoji);

// console.log(_$('.emoji-body>div img'))
// createImg = (a, i, e) => {
//     if (e <= 9) {
//         a.append(
//             `{
//                 "name": "${i.name}",
//                 "short_name": "${i.short_name}",
//                 "category": "${i.category}",
//                 "image": "${i.image}",
//                 "pattern": ":sy0000${e}:"
//             },`
//         );

//     } else if (e > 9 && e < 100) {
//         a.append(
//             `{
//                 "name": "${i.name}",
//                 "short_name": "${i.short_name}",
//                 "category": "${i.category}",
//                 "image": "${i.image}",
//                 "pattern": ":sy000${e}:"
//             },`
//         );

//     } else if (e > 99 && e < 1000) {
//         a.append(
//             `{
//                 "name": "${i.name}",
//                 "short_name": "${i.short_name}",
//                 "category": "${i.category}",
//                 "image": "${i.image}",
//                 "pattern": ":sy00${e}:"
//             },`
//         );

//     } else if (e > 999 && e < 10000) {
//         a.append(
//             `{
//                 "name": "${i.name}",
//                 "short_name": "${i.short_name}",
//                 "category": "${i.category}",
//                 "image": "${i.image}",
//                 "pattern": ":sy0${e}:"
//             },`
//         );

//     }
// };

// recent.map((i,e)=> createImg(e_smiley_and_people));
// flags.map((i,e)=> createImg(e_flags,i,e));
// smiley_and_people.map((i,e)=> createImg(e_smiley_and_people,i,e));
// animal_and_nature.map((i,e)=> createImg(e_animal_and_nature,i,e));
// food_and_drink.map((i,e)=> createImg(e_food_and_drink,i,e));
// activities.map((i,e)=> createImg(e_activities,i,e));
// travel_and_places.map((i,e)=> createImg(e_travel_and_places,i,e));
// objects.map((i,e)=> createImg(e_objects,i,e));
// symbols.map((i,e)=> createImg(e_symbols,i,e));
