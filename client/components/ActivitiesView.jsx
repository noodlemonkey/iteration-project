import React, { useState, useEffect } from 'react';
import { connect, useDispatch, useSelector, shallowEqual } from 'react-redux';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Button from 'react-bootstrap/Button';
import * as actions from '../actions/actions';

const mapStateToProps = ({
  informationReducer: { lat, long, countryCode, city },
}) => ({ lat, long, countryCode, city });

const ActivitiesView = (props) => {
  useSelector((state) =>
    console.log('state at top ', state.informationReducer)
  );
  const [activitiesData, setActivitiesData] = useState([]);
  const [fetchedData, setFetchedData] = useState(false);
  const [currentActivities, setCurrentActivities] = useState([]);
  const userFavorites = useSelector(
    (state) => state.informationReducer.userFavorites,
    shallowEqual
  );
  const loggedIn = useSelector((state) => state.informationReducer.isLoggedIn);
  const userEmail = useSelector(
    (state) => state.informationReducer.currentUser.Email,
    shallowEqual
  );
  // console.log('Top of page with userFavorites ', userFavorites);
  // console.log('Top of page with userEmail ', userEmail);
  // const [userFavorite, setUserFavorite] = useState(false);
  const dispatch = useDispatch();
  //^^ CURRENTLY USER WILL BE DUMMY INFO,

  const countryCode = 'US';
  const DEFAULT_IMG =
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80';

  const createActivities = (activitiesObject, category) => {
    console.log('loggedIn', loggedIn);
    return activitiesObject.map((activitiesInfo, i) => {
      console.log('value of id ', activitiesInfo);
      const renderStar = checkIfFavorite(activitiesInfo.id, userFavorites);
      return (
        <Card
          key={`activities-card-${i}`}
          className={'activity-card'}
          style={{ width: '400px' }}
        >
          <div className="card-img-container">
            <Card.Img
              className="card-img"
              variant="top"
              src={activitiesInfo.image_url}
            />
          </div>
          <Card.Body>
            <Card.Title>{activitiesInfo.name}</Card.Title>
            <Card.Text>Rating: {activitiesInfo.rating}</Card.Text>
            <Card.Text>Reviews: {activitiesInfo.review_count}</Card.Text>
            <Card.Text>Location: {activitiesInfo.location.address1}</Card.Text>
          </Card.Body>
          <Card.Footer>
            {/* change the value of whats going to go in here */}
            {/*  */}
            {renderStar ? (
              <img
                onClick={(e) => {
                  removeFavorite(e);
                }}
                src="https://www.flaticon.com/svg/static/icons/svg/148/148841.svg"
                height="20px"
                id={activitiesInfo.id}
                data-address1={activitiesInfo.location.address1}
                data-name={activitiesInfo.name}
                data-city={activitiesInfo.location.city}
                data-zip_code={activitiesInfo.location.zip_code}
                data-country={activitiesInfo.location.country}
                data-review_count={activitiesInfo.review_count}
                data-price={activitiesInfo.price}
                data-image_url={activitiesInfo.image_url}
                data-yelp_url={activitiesInfo.yelp_url}
                // data-display_phone={activitiesInfo.display_phone}                      //ADD THE COLUMN TO THE DATABASE
              ></img>
            ) : (
              <img
                onClick={addFavorite}
                src="https://www.flaticon.com/svg/static/icons/svg/149/149222.svg"
                height="20px"
                id={activitiesInfo.id}
                data-address1={activitiesInfo.location.address1}
                data-name={activitiesInfo.name}
                data-city={activitiesInfo.location.city}
                data-zip_code={activitiesInfo.location.zip_code}
                data-country={activitiesInfo.location.country}
                data-review_count={activitiesInfo.review_count}
                data-price={activitiesInfo.price}
                data-image_url={activitiesInfo.image_url}
                data-yelp_url={activitiesInfo.yelp_url}
                // data-display_phone={activitiesInfo.display_phone}                       //ADD THE COLUMN TO THE DATABASE
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
        'Content-Type': 'Application/JSON',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setActivitiesData(data);
        setFetchedData(true);
        setCurrentActivities(createActivities(data));
      })
      .catch((err) => console.log('Activities fetch ERROR: ', err));
  };

  const checkIfFavorite = (yelp_id, uF) => {
    for (let i = 0; i < uF.length; i++) {
      if (uF[i].yelp_id === yelp_id) {
        return true;
      }
    }
    return false;
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
    // console.log('here is your favorite address ******************: ', e.target.getAttribute("data-address1") )
    fetch(`/favorites/${userEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON',
      },
      body: JSON.stringify({
        yelp_id: e.target.id,
        address1: e.target.getAttribute('data-address1'),
        name: e.target.getAttribute('data-name'),
        city: e.target.getAttribute('data-city'),
        zip_code: e.target.getAttribute('data-zip_code'),
        country: e.target.getAttribute('data-country'),
        review_count: e.target.getAttribute('data-review_count'),
        price: e.target.getAttribute('data-price'),
        image_url: e.target.getAttribute('data-image_url'),
        yelp_url: e.target.getAttribute('data-yelp_url'),
        // display_phone: e.target.getAttribute('data-display_phone'),                      //ADD THE COLUMN TO THE DATABASE
      }),
    })
      .then((response) => {
        response.json();
      })
      .then((userFavs) => {
        fetch(`/favorites/${userEmail}`, {
          headers: {
            'content-type': 'Application/JSON',
          },
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            // console.log('this is your data in addFavorites', data);
            dispatch(actions.updateFavorites(data));
          });
        // NEED TO FIGURE OUT WHAT WE NEED TO GRAB FROM DATA RETURNED
        // setUserFavorite(true);
        // TODO: CHANGE THE RENDERING with temp.
      });
  };

  const removeFavorite = (e) => {
    console.log('Removing favorite: ', e.target.id);
    fetch(`/favorites/${userEmail}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'Application/JSON',
      },
      body: JSON.stringify({
        yelp_id: e.target.id,
      }),
    })
      .then((response) => {
        response.json();
      })
      .then((userFavs) => {
        // NEED TO FIGURE OUT WHAT WE NEED TO GRAB FROM DATA RETURNED
        console.log(userFavs);
        dispatch(actions.updateFavorites(userFavs));
      })
      .then((response) => {
        response.json();
      })
      .then((userFavs) => {
        // NEED TO FIGURE OUT WHAT WE NEED TO GRAB FROM DATA RETURNED
        // console.log(userFavs);
        dispatch(actions.updateFavorites(userFavs));
      })
      .then((userFavs) => {
        fetch(`/favorites/${userEmail}`, {
          headers: {
            'content-type': 'Application/JSON',
          },
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            dispatch(actions.updateFavorites(data));
          });
        // NEED TO FIGURE OUT WHAT WE NEED TO GRAB FROM DATA RETURNED
        // setUserFavorite(true);
        // TODO: CHANGE THE RENDERING with temp.
      });
  };

  useEffect(() => {
    if (!fetchedData) fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [props.city]);

  useEffect(() => {
    fetchData();
    // console.log('in useEffect for userFavorites', userFavorites)
  }, [userFavorites]);

  if (!activitiesData) return null;

  if (fetchedData) {
    const CATEGORIES = [
      'restaurants',
      'bars',
      'climbing',
      'health',
      'bowling',
      'fitness',
    ];
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
        </Button>
      );
    }

    return (
      <div className="activities-container">
        <h1 id="title">Local Activities Information</h1>
        <div className="activities-buttons">{buttonsArray}</div>
        <div className="cards-container">
          <CardDeck>{currentActivities}</CardDeck>
        </div>
      </div>
    );
  } else {
    return <h1 id="title">Fetching from database</h1>;
  }
};

export default connect(mapStateToProps, null)(ActivitiesView);
