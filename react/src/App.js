import React from 'react';
import './App.css';

const monthName = [];
monthName[0] = "January";
monthName[1] = "February";
monthName[2] = "March";
monthName[3] = "April";
monthName[4] = "May";
monthName[5] = "June";
monthName[6] = "July";
monthName[7] = "August";
monthName[8] = "September";
monthName[9] = "October";
monthName[10] = "November";
monthName[11] = "December";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      calculated: false,
      customerRewards: []
    };
    this.calculateRewards = this.calculateRewards.bind(this);
  }

  /* This initializes with random test data for last 3 months */
  initializeData = () => {
    var today = new Date();
    var dt = new Date();
    dt.setMonth(dt.getMonth() - 3);
    let data = [];
	/* looping for last 3 month*/
    while( !((dt.getDate() === today.getDate()) 
                && (dt.getMonth() === today.getMonth())
                    && (dt.getFullYear() === today.getFullYear())) ) {
        let expanse = {
          customerId: 'CUST_' + parseInt(Math.random() * 5 + 1), // setting 5 random customer
          expanseDate: new Date(dt.getTime()), 
          expanseAmount: parseInt(Math.random() * 500), // setting random amount between 0 and 500
          rewards: ""
        }
        data.push(expanse);
        dt.setDate(dt.getDate() + 1);
    }
	/* setting the initialized data to state of react*/
    this.setState({
      data: data
    });
  }

  /* this funcion will be called by react lifecycle */
  componentDidMount = () => {
    this.initializeData();
  }

  /* this function renders the randomly generated expense data. */
  renderExpanse = () => {
    return this.state.data.map((expanse, index) => {
       const { expanseDate, expanseAmount, rewards, customerId} = expanse;
       return (
          <tr key={index}>
              <td>{customerId}</td>
             <td>{expanseDate.toDateString()}</td>
             <td>{expanseAmount}</td>
             <td>{rewards}</td>
          </tr>
       )
    })
 }

 /* this function sets the header of table */
 renderExpanseHeader = () => {
    if(this.state.data[0]) {
      let header = Object.keys(this.state.data[0]);
      return header.map((key, index) => {
        return <th key={index}>{key.toUpperCase()}</th>
     });
    }
    
 }

/* this funciton sets calculated expense in customer expanse table. */
 renderCustExpanse = (custReward) => {
  if(custReward) {
   return custReward.month.map((month, index) => {
       return (
         <tr key={index}>
             <td>{monthName[month]}</td>
             <td>{custReward.reward[month]}</td>
         </tr>
       )
   });
  }
}

/* this function sets header of customer expanse table */
renderCustExpanseHeader = (custReward) => {
 if(custReward) {
   let header = Object.keys(custReward);
   return header.map((key, index) => {
     return <th key={index}>{key.toUpperCase()}</th>
  });
 } 
}

/* this funciton is to calculate reward */
 calculateRewards = () => {
  let calculationData = [];
  let customerRewardsData = [];
  
  this.state.data.map((expanse, index) => {//iterating test data
    let rewards = 0;
    if(expanse.expanseAmount > 100) {
      rewards = ((expanse.expanseAmount - 100) * 2 ) + 50;//setting 2 dollars for expanse above 100 and 50 for expanse above 50
    } else if(expanse.expanseAmount > 50) {
      rewards = expanse.expanseAmount - 50; //setting 1 dollars for expanse above 50 
    }
    expanse.rewards = rewards;
    if(!customerRewardsData[expanse.customerId]) {//if customerreward is not initialized then creating new custReward obj
      let custReward = {
        month: [],
        reward: []
      }
      let expanseMonth = expanse.expanseDate.getMonth();
      custReward.month[expanseMonth] = expanseMonth; // setting month data in custReward obj
      custReward.reward[expanseMonth] = rewards;// setting reward data in custReward obj
      customerRewardsData[expanse.customerId] = custReward;// setting custReward data in customerRewardsData map
    } else {//if customerreward is initialized
      let custId = expanse.customerId;
      let custReward = customerRewardsData[custId]; // retrieving custReward from customerRewardsData map
      let expanseMonth = expanse.expanseDate.getMonth();
      if(custReward.reward[expanseMonth]) { // checking if reward value exist
        custReward.reward[expanseMonth] += rewards; // adding calculated reward with new reward
      } else {
        custReward.reward[expanseMonth] = rewards; // setting reward value
      }

      if(!custReward.month[expanseMonth]) {
        custReward.month[expanseMonth] = expanseMonth; // setting month data in custReward obj
      } 
    }
    calculationData.push(expanse);
  });
  
  this.setState({// setting calculationData and customerRewardsData to react state
    data: calculationData,
    calculated: true,
    customerRewards: customerRewardsData
  });
  
 }

 //below funciton will render UI
  render() {
    let {customerRewards} = this.state;
    return (
      <div>
        <div className="data_container">
            <h1 id='title' className='title'>Rewards Calculation</h1>
            <button className='button' onClick={this.calculateRewards}>Calculate</button>
            
            {
              Object.entries(customerRewards).sort().map(([custId, customerReward]) => {
                
                return(<div key={'div_' + custId}>
                  <h1 key={'header_' + custId}>Data of : {custId} </h1>
                  <table key={'cust_expanse' + custId} className={this.state.calculated ? 'cust_expanse' : 'cust_hidden'}>
                  <tbody>
                      <tr>{this.renderCustExpanseHeader(customerReward)}</tr>
                      {this.renderCustExpanse(customerReward)}
                  </tbody>
                </table> 
                </div>);
             })
            }
            
            <table id='expanse' className='expanse'>
               <tbody>
                  <tr>{this.renderExpanseHeader()}</tr>
                  {this.renderExpanse()}
               </tbody>
            </table>
        </div>
      </div>
    );
  }
}

export default App;
