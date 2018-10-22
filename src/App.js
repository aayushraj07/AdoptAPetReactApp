import React from "react";
import { render } from "react-dom";
import pf from "petfinder-client";
import Pet from "./Pet";

const petfinder = pf({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pets: []
    };
  }

  componentDidMount() {
    petfinder.pet
      .find({ output: "full", location: "Seattle, WA" })
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
  }
  render() {
    return (
      <div>
        <h1>Adopt Me!</h1>
        <Pet name="Scooby" animal="dog" breed="Havanese" />
        <Pet name="Pepper" animal="bird" breed="Cockatiel" />
        <Pet name="Doink" animal="animal" breed="Mixed" />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
