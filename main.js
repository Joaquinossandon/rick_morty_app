// https://rickandmortyapi.com/api/character
const buttonNext = document.getElementById("siguiente");

// const getCharacters = async () => {
//     const respuesta = await fetch("https://rickandmortyapi.com/api/character/");
//     const respuestaJSON = await respuesta.json();
//     const personajes = respuestaJSON.results;
//     return personajes;
// };

async function* getCharacters2() {
    const respuesta = await fetch("https://rickandmortyapi.com/api/character/");
    const respuestaJSON = await respuesta.json();
    const { info, results } = respuestaJSON;
    let next = info.next;
    yield results;
    while (next) {
        const respuesta = await fetch(next);
        const respuestaJSON = await respuesta.json();
        yield respuestaJSON.results;
        next = respuestaJSON.info.next;
    }

    return [];
}

const obtenerPersonajes = getCharacters2();

const renderCharacters = async () => {
    const { value: personajes, done } = await obtenerPersonajes.next();
    if (!done) {
        const htmlArray = personajes.map((personaje) => {
            return `
                    <div class="col">
                        <div class="card">
                            <img
                                src="${personaje.image}"
                                class="card-img-top"
                                alt="..."
                            />
                            <div class="card-body">
                                <h5 class="card-title mb-0">${personaje.name}</h5>
                                <p>${personaje.status} - ${personaje.species}</p>
                                <h6>Origen</h6>
                                <p>${personaje.origin.name}</p>
                            </div>
                        </div>
                    </div>
                `;
        });
        const html = htmlArray.join("");
        const contenedorPersonajes = document.getElementById("personajes");
        contenedorPersonajes.innerHTML = html;
        return;
    }

    return (buttonNext.disabled = true);
};
buttonNext.addEventListener("click", renderCharacters);
renderCharacters();
