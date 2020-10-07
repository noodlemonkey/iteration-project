import React, { useState, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Button from 'react-bootstrap/Button';
import * as actions from '../actions/actions';

const mapStateToProps = ({
  informationReducer: { lat, long, countryCode },
}) => ({ lat, long, countryCode });

const ActivitiesView = (props) => {
  const [activitiesData, setActivitiesData] = useState([]);
  const [fetchedData, setFetchedData] = useState(false);
  const [currentActivities, setCurrentActivities] = useState([]); // DISCUSS
  const userFavorites = useSelector(state => state.informationReducer.userFavorites)
  const userId = useSelector(state => state.informationReducer.currentUser._id)
  const dispatch = useDispatch()
  //^^ CURRENTLY USER WILL BE DUMMY INFO,

  const countryCode = 'US';
  const DEFAULT_IMG = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80';

  const createActivities = (activitiesObject, category) => {
    return activitiesObject.map((activitiesInfo, i) => {
      
      const renderStar = checkIfFavorite(activitiesInfo.id);
      return (
        <Card key={`activities-card-${i}`} className={'activity-card'} style={{ 'width': '400px' }}>
          <div className="card-img-container">
            <Card.Img className="card-img" variant="top" src={activitiesInfo.image_url} />
          </div>
          <Card.Body>
            <Card.Title>{activitiesInfo.name}</Card.Title>
            <Card.Text>
              Rating: {activitiesInfo.rating}
            </Card.Text>
            <Card.Text>
              Reviews: {activitiesInfo.review}
            </Card.Text>
            <Card.Text>
              Location: {activitiesInfo.location.address1}
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            {/* change the value of whats going to go in here */}
            {/*  */}
            {renderStar ? (
              <img
                onClick={removeFavorite}
                src="https://www.flaticon.com/svg/static/icons/svg/148/148841.svg"
                height="20px"
                id={activitiesInfo.id}
              ></img>
            ) : (
              <img
                onClick={addFavorite}
                src="https://www.flaticon.com/svg/static/icons/svg/149/149222.svg"
                height="20px"
                id={activitiesInfo.id}
              ></img>
            )}
          </Card.Footer>
        </Card>
      );
    });
  };

  const fetchData = (category = 'bars') => {
    fetch(`/businesses/${category}?lat=${props.lat}&lon=${props.long}`, {
      method: 'GET',
      headers: {
        "Content-Type": "Application/JSON",
      },
    })
      .then((res) => (res.json()))
      .then((data) => {
        setActivitiesData(data);
        setFetchedData(true);
        setCurrentActivities(createActivities(data));
      })
      .catch((err) => console.log('Activities fetch ERROR: ', err));
  };

  const checkIfFavorite = (id) => {
    for (let i = 0; i < userFavorites.length; i++){
      if (userFavorites[i].id === id)  return true
    }
     return false
  };

  const changeCategory = (category) => {
    return () => {
      fetchData(category);
      // setCurrentActivities(createActivities(activitiesData, category)); // DISCUSS
    };
  };
  
  // Grabs yelp rest. ID from the favorite icon's id and sends it backend to be added
  // to user favorites.
  const addFavorite = (e) => {
  console.log('here is your favorite: ', e.target.id)
  fetch('/', { // <-- get route to send to
    method: 'POST',
    headers: {
      "Content-Type": "Application/JSON"
    },
    body: JSON.stringify({
      userId: userId,
      favoriteId: e.target.id,
    })
  }).then(response => {
    response.json()
  }).then(userFavs => {
    // NEED TO FIGURE OUT WHAT WE NEED TO GRAB FROM DATA RETURNED
    console.log(userFavs);
    dispatch(actions.updateFavorites({ uesrFavs }));
  })
}

const removeFavorite = (e) => {
  console.log('Removing favorive: ', e.target.id)
  fetch('/', {
    method: 'DELETE',
    headers: {
      "Content-Type": "Application/JSON"
    },
    body: JSON.stringify({
      userId: userId, 
      favoriteId: e.target.id
    })
  }).then(response => {
    response.json()
  }).then(userFavs => {
    // NEED TO FIGURE OUT WHAT WE NEED TO GRAB FROM DATA RETURNED
    console.log(userFavs);
    dispatch(actions.updateFavorites({ uesrFavs }));
  })
}

  useEffect(() => {
    if (!fetchedData) fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [props.city])


  if (!activitiesData) return null;

  if (fetchedData) {
    const CATEGORIES = ['restaurants', 'bars', 'climbing', 'health', 'bowling', 'fitness'];
    const buttonsArray = [];

    for (let i = 0; i < CATEGORIES.length; i += 1) {
      buttonsArray.push(
        <Button
          key={`b${i}`}
          className="mx-1 my-3"
          variant="dark"
          onClick={changeCategory(CATEGORIES[i])}
          id={CATEGORIES[i]}
        >
          {CATEGORIES[i]}
        </Button>,
      );
    }

    return (
      <div className="activities-container">
        <h1 id="title">Local Activities Information</h1>
        <div className="activities-buttons">
          {buttonsArray}
        </div>
        <div className="cards-container">
          <CardDeck>
            {currentActivities}
          </CardDeck>
        </div>
      </div>
    );
  } else {
    return (
      <h1 id="title">Fetching from database</h1>
    );
  }
};

export default connect(mapStateToProps, null)(ActivitiesView);
