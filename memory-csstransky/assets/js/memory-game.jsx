import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}

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
		//				short delay (3 sec?)
		//				panel.hidden = true
		//				hide compare_string panel
		//
		//			compare_string = ""
		
		this.state = {
			panel_list: _.shuffle("AABBCCDDEEFFGGHH")
        .map(function (letter) {
				  return { value: letter, hidden: true }; 
        }),
      compare_string: "",
			score: 0
		}
  }

	flip(ii, _ev) {
		let compare_string = this.state.compare_string;

		let compare_panel_index = this.state.panel_list
			.findIndex((panel, jj) => {
				if (panel.value === this.state.compare_string && !panel.hidden) {
					return jj;
				}
		});

    // Weird bug where the 0 element will return -1 instead
    if (compare_panel_index == -1) {
      compare_panel_index = 0;
    }

		let swap_back_last_panel = false;
		let state2 = this.state.panel_list
			.map((panel, jj) => { 
				if (jj === ii && panel.hidden) {
					console.log("Found panel: " + jj);
					if (compare_string == "") {
						return {...panel, hidden: false}
					}
					else if (compare_string != panel.value) {					
						// Show panel here
						// Add delay later with this flag
						swap_back_last_panel = true;
						return {...panel, hidden: false }	
					}
					else {
						return {...panel, hidden: false };
					}
				}
				else {
					return panel;
			}});

			// First block to compare click
			if (this.state.panel_list[ii].hidden && compare_string == "") {
				this.setState({
					panel_list: state2,
					compare_string: this.state.panel_list[ii].value,
				});
			}
			// Match found
			else if (this.state.panel_list[ii].value == compare_string 
        && ii != compare_panel_index){
				console.log("BIGGER RIOT");
				this.setState({
					panel_list: state2,
					compare_string: "",
				});
			}
			// No Match found
			else if (this.state.panel_list[ii].hidden && compare_string != "") {	
				this.setState({
					panel_list: state2,
					score: this.state.score + 1,
				});
				window.setTimeout(function () {
					let state3 = this.state.panel_list.map((panel3, kk) => {
            if (compare_panel_index === kk) {
							return {...panel3, hidden: true}
						}
						else {
							return panel3;
						}
					});
					let state4 = state3.map((panel4, jj) => { 
						if (jj === ii) {
							return {...panel4, hidden: true}
						}
						else {
							return panel4
						}
					});

					this.setState({
						panel_list: state4,
						compare_string: "",
					});
				}.bind(this), 625);
			}
	}

 	reset() {
		let state1 = {
			panel_list: _.shuffle("AABBCCDDEEFFGGHH")
				.map(function (letter) {
					return { value: letter, hidden: true }; 
				}),
			compare_string: "",
			score: 0
		}
		this.setState(state1);
	}

  render() {
		let gameboard = _.map(
			_.chunk(this.state.panel_list, 4), (rowOfTiles, rowNum) => {
				return <div className="row" key={rowNum}>{
						_.map(rowOfTiles, (panel, colNum) => {
							let ll = rowNum * 4 + colNum;
							return <div className="column" key={ll}>
								<div className="panel" 
										 onClick={this.flip.bind(this, ll)}>
								<RenderPanel value={panel.value}
														 hidden={panel.hidden} />
								</div>					
							</div>;
							})
						}</div>
				});

		return <div>SCORE: {this.state.score} 
				{gameboard}
				<p><button onClick={this.reset.bind(this)}>Restart</button></p>
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
