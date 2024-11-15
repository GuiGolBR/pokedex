const params = new URLSearchParams(window.location.search)
window.onload = function () {

    const id = params.get(`id`)
    const container = document.getElementById('container2');

    function capitalize(s) {
        return s && String(s[0]).toUpperCase() + String(s).slice(1);
    }

    const jsonPokemon = async (path) => {
        const answer = await fetch(path);
        const pokemon = await answer.json();
        return pokemon;
    }

    const buildCard = async ( ) => {
        const card = document.createElement('div');
        const name = document.createElement('p');
        const image = document.createElement('img');
        const pokemon = await jsonPokemon(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const shiny = document.createElement('img');

        card.className = "card2";
        card.setAttribute('data-tilt', '');

        name.innerHTML = capitalize(pokemon.species.name);
        name.className = "pokemonNome2"
        card.appendChild(name)

        shiny.src = "https://archives.bulbagarden.net/media/upload/d/d1/ShinySVStar.png";
        shiny.alt = "Shiny";
        shiny.hidden = true;
        shiny.className = "shiny"
        card.appendChild(shiny)

        image.src = pokemon.sprites.front_default;
        image.alt = capitalize(pokemon.species.name);
        image.className = "pokemonSprite2"
        card.appendChild(image)

        try {
            const firstType = pokemon.types[0]?.type?.name;

            card.style.backgroundColor = `transparent`
            card.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.3)), url("https://s3.pokeos.com/pokeos-uploads/type/type_bg/${capitalize(firstType)}.webp")`;
            card.style.backgroundSize = 'cover';
            card.style.position = 'relative';

            card.addEventListener("mouseenter", () => {
                card.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("https://s3.pokeos.com/pokeos-uploads/type/type_bg/${capitalize(firstType)}.webp")`; // Remove darkness when hovering
            });

            card.addEventListener("mouseleave", () => {
                card.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.3)), url("https://s3.pokeos.com/pokeos-uploads/type/type_bg/${capitalize(firstType)}.webp")`; // Restore darkness when not hovering
            });

            card.style.color = 'white';


            for (const ele of pokemon.types) { // Use for...of to handle async operations
                const typing = await jsonPokemon(ele.type.url);
                const typings = document.createElement("img"); // Create a new img element for each type
                typings.src = typing.sprites["generation-ix"]["scarlet-violet"].name_icon;
                typings.className="type2"

                card.appendChild(typings); // Append the img element to the card
            };
        } catch (error) {
            console.error(`Error fetching image for typing: `, error);
            typings.src = "https://via.placeholder.com/150"
        }

        const click = ( e ) => {
            const card = e.currentTarget;

            if (image.src === pokemon.sprites.front_default) {
                image.src = pokemon.sprites.front_shiny
                shiny.hidden = false
            } else {
                image.src = pokemon.sprites.front_default
                shiny.hidden = true
            }


        }

        card.onclick = click;

        container.appendChild(card);

        VanillaTilt.init(document.querySelectorAll(".card2"), {
            max: 30,
            scale: 1.1,
        })

    }

    buildCard()

    }