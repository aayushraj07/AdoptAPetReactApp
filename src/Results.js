import React from "react";

import pf from "petfinder-client";
import { Consumer } from "./SearchContext";
import Pet from "./Pet";
import SearchBox from "./SearchBox";

const petfinder = pf({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET
});

class Results extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pets: []
    };
  }

  componentDidMount() {
    this.search();
  }

  search = () => {
    petfinder.pet
      .find({
        output: "full",
        location: this.props.searchParams.location,
        animal: this.props.searchParams.animal,
        breed: this.props.searchParams.breed
      })
      .then(data => {
        let pets;

        if (data.petfinder.pets && data.petfinder.pets.pet) {
          //this conditon checks whether it has pets or not.
          if (Array.isArray(data.petfinder.pets.pet)) {
            //this condition checks that  if the gathered data from API is in array or not
            pets = data.petfinder.pets.pet;
          } else {
            pets = [data.petfinder.pets.pet]; //if the data is not in array then it will make one , array
          }
        } else {
          pets = []; //else will remain as it is , empty
        }
        this.setState({ pets });
        // console.log(data);
      });
  };
  render() {
    return (
      <div className="search">
        <SearchBox search={this.search} />
        {this.state.pets.map(pet => {
          let breed;

          if (Array.isArray(pet.breeds.breed)) {
            breed = pet.breeds.breed.join(", ");
          } else {
            breed = pet.breeds.breed;
          }
          return (
            <Pet
              key={pet.id}
              animal={pet.animal}
              name={pet.name}
              breed={breed}
              media={pet.media}
              location={`${pet.contact.city},${pet.contact.state}`}
              id={pet.id}
            />
          );
        })}
      </div>
    );
  }
}

export default function ResultsWithContext(props) {
  return (
    <Consumer>
      {context => <Results {...props} searchParams={context} />}
    </Consumer>
  );
}
