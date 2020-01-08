import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}

let SWITCHBACKTIME = 675;
let NUMOFCOLUMNS = 4;

class Starter extends React.Component {
  constructor(props) {
    super(props);

		// When panel is clicked,
		//	if panel.hidden == true
		//		if compare_string == empty
		//			panel.hidden = false
		//			compare_string = panel.value
		//
		//		else compare_string != empty
		//			show that panel
		//
		//			if compare_string != panel.value
		//				short delay (1 sec?)
		//				panel.hidden = true
		//				hide compare_string panel
		//
		//			compare_string = ""

		this.state = {
			panel_list: _.shuffle("AABBCCDDEEFFGGHH").map(function (letter) {
			  return { value: letter, hidden: true };
      }),
      compare_string: "",
			score: 0
		}
  }

	flip(chosen_index, _ev) {

		let compare_string = this.state.compare_string;

    // This is the index of the first panel chosen after clicking another panel
		let compare_panel_index = this.state.panel_list.findIndex((panel, index) => {
		  if (panel.value === this.state.compare_string && !panel.hidden) {
			  return index;
			}
		});

    // Weird bug where the 0 element will return -1 instead
    if (compare_panel_index == -1) {
      compare_panel_index = 0;
    }

		let new_panel_list = this.state.panel_list.map((panel, index) => {
			if (index === chosen_index) {
				console.log("Found panel: " + index);
				return {...panel, hidden: false };
			}
			else {
				return panel;
		}});

    // Uses a "LOCK" to stop all inputs
    if (compare_string != "LOCK" && this.state.panel_list[chosen_index].hidden) {
  		// First block to compare click
  		if (compare_string == "") {
  			this.setState({
  				panel_list: new_panel_list,
  				compare_string: this.state.panel_list[chosen_index].value,
  			});
  		}
  		// Match found
  		else if (this.state.panel_list[chosen_index].value == compare_string
              && chosen_index != compare_panel_index){
  			console.log("MATCH!");
  			this.setState({
  				panel_list: new_panel_list,
  				compare_string: "",
  			});
        if (new_panel_list.every((panel) => !panel.hidden)) {
          alert("You Won!\nFinal Score: " + this.state.score);
        }
  		}
  		// No Match found
  		else if (compare_string != "") {
  			this.setState({
  				panel_list: new_panel_list,
  				score: this.state.score + 1,
          compare_string: "LOCK"
  			});
  			window.setTimeout(
          this.flip_back_function(compare_panel_index, chosen_index).bind(this),
          SWITCHBACKTIME
        );
  		}
    }
	}

  flip_back_function(first_panel_index, second_panel_index) {
    return function() {
      let new_panel_list = this.state.panel_list.map((panel, index) => {
        if (first_panel_index === index || second_panel_index === index) {
          return {...panel, hidden: true}
        }
        else {
          return panel;
        }
      });

      this.setState({
        panel_list: new_panel_list,
        compare_string: "",
      });
    }
  }

 	reset() {
		let state = {
			panel_list: _.shuffle("AABBCCDDEEFFGGHH").map(function (letter) {
			  return { value: letter, hidden: true };
			}),
			compare_string: "",
			score: 0
		}
		this.setState(state);
	}

  render() {
		let gameboard = _.map(
      _.chunk(this.state.panel_list, NUMOFCOLUMNS), (rowOfTiles, rowNum) => {
				return <div className="row" key={rowNum}>{
				  _.map(rowOfTiles, (panel, colNum) => {
					  let panel_index = rowNum * NUMOFCOLUMNS + colNum;
					  return <span><div className="column" key={panel_index}>
						  <div className="panel" onClick={this.flip.bind(this, panel_index)}>
							  <RenderPanel value={panel.value} hidden={panel.hidden} />
						  </div>
						</div></span>;
          })
				}</div>
			}
    );

		return <div>SCORE: {this.state.score}
		  {gameboard}
			<p><button onClick={this.reset.bind(this)}>Restart</button></p>
      <p>Link back to the main domain: <a href="https://cstransky.com/">cstransky.com</a>.<br/></p>
		</div>;
  }
}

function RenderPanel({value, hidden}) {
	if (hidden) {
		return <p></p>;
	}
	else {
		return <p>{value}</p>;
	}
}
