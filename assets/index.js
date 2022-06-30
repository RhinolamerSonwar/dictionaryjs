const wrapper = document.querySelector(".wrapper"),
  searchInput = wrapper.querySelector("input"),
  synonymss = wrapper.querySelector(".synonym .list"),
  volume = wrapper.querySelector(".word i"),
  removeIcon = wrapper.querySelector(".search span"),
  infoText = wrapper.querySelector(".info-text"),
  wordMeanings = document.querySelector('.meaning > .details div'),
  example = document.querySelector('.example > .details div'),
  searchWord = document.getElementById('the-word'),
  resetBtn = document.querySelector('.material-icons');
 let audio;

// fetch api function
infoText.innerHTML = `Type any existing word and press enter to get meaning, example,
  synonyms, etc.`
const reset = () => {
  wordMeanings.innerHTML = '';
  synonymss.innerHTML = '';
  wrapper.classList.remove("active");
  infoText.style.color = "";
}
const serchingWord = (word) => {
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
  infoText.style.color = "#000";
  setTimeout(() => {
    infoText.innerHTML = ``;
  }, 500);
 }

const fetchWordInfo = async (word) => {
  try {
    serchingWord(word);
    const getWord = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    if (!getWord.ok) throw new Error('Word not valid!');
    const wordData = await getWord.json();
    const { phonetic, meanings} = wordData[0];
    let allsynonyms = [...meanings[0].synonyms]; // I inteded to concatenate the arrays here by spreading them but has error. feel free to change.
    
    meanings.forEach(meaning => {
      let { partOfSpeech, definitions } = meaning;
      
      wordMeanings.innerHTML += `${(partOfSpeech).toUpperCase()} <li> ${definitions[0].definition}</li>`;
      example.innerHTML = definitions[0].example ?? `No example given`;
      
    });
    
    // populate synonyms
    if (allsynonyms.length === 0) synonymss.innerHTML = `${word} has no synonyms...`;
    allsynonyms.forEach((syn, i) => {
      let synonymL = document.createElement('span');
      synonymL.textContent = allsynonyms[i];
      synonymss.append(synonymL);
    });

    searchWord.textContent = `${word}`;
    document.getElementById('populate-phonetic').innerHTML = `Pronounced as: ${phonetic}`;
    wrapper.classList.add("active");
        
  }
  catch (err) {
    alert(`Something went wrong! ${err.message}`);
  }

}
// On Enter 
document.addEventListener('keyup', (e, word) => {
  word = searchInput.value;
  if (e.keyCode === 13 && word) {
    reset();
    fetchWordInfo(word);
  }
})

resetBtn.addEventListener('click', () => {
  infoText.innerHTML = `Type any existing word and press enter to get meaning, example,
  synonyms, etc.`
  searchInput.value = '';
  searchInput.focus();
   reset();
})

volume.addEventListener("click", () => {
  volume.style.color = "#4D59FB";
  // audio.play();
  setTimeout(() => {
    volume.style.color = "#999";
  }, 500);
});
