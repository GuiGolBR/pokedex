window.onload = function () {

    const regionFilter = document.getElementById('regionFilter');
    const load = document.getElementById('load');
    const container = document.getElementById('container');

    function capitalize(s) {
        return s && String(s[0]).toUpperCase() + String(s).slice(1);
    }

    const jsonPokemon = async (path) => {
        const answer = await fetch(path);
        const data = await answer.json();
        return data;
    }

    const click = ( e ) => {
        const card = e.currentTarget;



        window.location = `details.html?id=${card.dataset.id}`


    }


    jsonPokemon('https://pokeapi.co/api/v2/region').then(data => {
        // Assuming `data` contains the region data as a list or array
        data.results.forEach(ele => {
            const option = document.createElement('option'); // Create the option element for each region
            option.value = ele.name; // Set the value attribute for the option
            option.textContent = capitalize(ele.name); // Set the display text for the option
            regionFilter.appendChild(option); // Append the option to the select element
        });
    }).catch(error => {
        console.error("Error fetching regions:", error);
    });

    const buildCard = async (pokemon) => {
        const card = document.createElement('div');
        const name = document.createElement('p');
        const image = document.createElement('img');
        const typings = document.createElement('img');

        card.className = "card";
        card.setAttribute('data-tilt', '');

        name.innerHTML = capitalize(pokemon.pokemon_species.name);
        name.className = "pokemonNome";
        card.appendChild(name);

        try {
            const sprites = await jsonPokemon(`${(pokemon.pokemon_species.url).replace("-species", "")}`);
            image.src = sprites.sprites.front_default || "https://via.placeholder.com/150";
        } catch (error) {
            console.error(`Error fetching image for ${pokemon.pokemon_species.name}:`, error);
            image.src = "https://via.placeholder.com/150"; // Fallback image
        }
        image.alt = pokemon.pokemon_species.name;
        image.className = "pokemonSprite"
        card.appendChild(image);

        try {
            const poke = await jsonPokemon(`${(pokemon.pokemon_species.url).replace("-species", "")}`);
            const firstType = poke.types[0]?.type?.name;

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


            for (const ele of poke.types) { // Use for...of to handle async operations
                const typing = await jsonPokemon(ele.type.url);

                const typings = document.createElement("img"); // Create a new img element for each type
                typings.src = typing.sprites["generation-ix"]["scarlet-violet"].name_icon;
                typings.className="type"

                card.appendChild(typings); // Append the img element to the card
            };
        } catch (error) {
            console.error(`Error fetching image for typing: `, error);
            typings.src = "https://via.placeholder.com/150"
        }

        card.onclick = click;

        card.dataset.id = pokemon.entry_number

        return card;


    }

    try {

        jsonPokemon(`https://pokeapi.co/api/v2/pokedex/kanto`).then(
            async ( obj ) => {
                const sortedEntries = obj.pokemon_entries.sort((a, b) => a.entry_number - b.entry_number);

                const cards = await Promise.all(sortedEntries.map(entry => buildCard(entry)));

                cards.forEach(card => container.appendChild(card));

                // Initialize VanillaTilt after cards are added to the DOM
                VanillaTilt.init(document.querySelectorAll(".card"), {
                    max: 30,
                    scale: 1.1,
                    glare: true,
                    "max-glare": 0.5
                });

                load.remove();

                }

            )
        } catch (error) {
                console.error(`Error fetching Pokémon data for region: ${regionFilter.value}`, error);
            }
    }
