import React, { useState, useEffect } from "react";
import styled from "./style/Homepage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faLocationDot,
  faChevronLeft,
  faChevronRight,
  faMagnifyingGlass,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../../context/GlobalContext";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Homepage() {
  const [popularEvents, setPopularEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [places, setPlaces] = useState([]);
  const [eventCategories, setEventCategories] = useState([]);
  const [eventCities, setEventCities] = useState([]);
  const [placeNames, setPlaceNames] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [initialEvents, setInitialEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const filteredEvents = events.filter((event) => {
      const eventStartingDate = new Date(event.eventStartingDate);
      const currentDate = new Date();
      if (eventStartingDate > currentDate) {
        return event;
      }
    });
    const sortedEvents = filteredEvents.sort((a, b) => {
      const dateA = new Date(a.eventStartingDate);
      const dateB = new Date(b.eventStartingDate);
      return dateA - dateB;
    });
    const closestEvents = sortedEvents.slice(0, 3);
    setUpcomingEvents(closestEvents);

    const pastEvents = events.filter((event) => {
      const eventEndDate = new Date(event.eventEndDate);
      const currentDate = new Date();
      return eventEndDate < currentDate;
    });
  }, []);

  const search = (value) => {
    if (value === "") {
      setEvents([...initialEvents]);
    } else {
      const filteredEvents = initialEvents.filter((event) =>
        event.eventTitle.toLowerCase().includes(value.toLowerCase())
      );
      setEvents([...filteredEvents]);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5022/api/Event/popular-events")
      .then((res) => setPopularEvents(res.data))
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:5022/api/Event")
      .then((res) => {
        setEvents(res.data);
        setInitialEvents(res.data);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:5022/api/Place")
      .then((res) => setPlaces(res.data))
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:5022/api/Event/categories-list")
      .then((res) => setEventCategories(res.data))
      .catch((err) => console.log(err));
    axios
      .get("http://localhost:5022/api/Event/cities-list")
      .then((res) => setEventCities(res.data))
      .catch((err) => console.log(err));
    axios
      .get("http://localhost:5022/api/Place/places-list")
      .then((res) => setPlaceNames(res.data))
      .catch((err) => console.log(err));
  }, []);

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long" };
    return new Date(dateString).toLocaleDateString("tr-TR", options);
  };

  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const handleNextSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const filterEventsByCategory = (category) => {
    setSelectedCategory(category);
    if (category === "") {
      setEvents([...filteredEvents]);
    } else {
      const filtered = events.filter(
        (event) => event.eventCategory === category
      );
      setEvents(filtered);
    }
  };

  const restartCategory = () => {
    setEvents([...initialEvents]);
    setSelectedCategory("");
  };

  const handleSwitchChange = () => {
    setIsChecked(!isChecked);
    if (isChecked) {
      const filtered = events.filter((event) => event.isEventPaid);
      setEvents(filtered);
    }
  };

  const handleReset = () => {
    setSelectedOption("");
    setEvents(initialEvents);
  };

  const handleRadioChange = (selectedPlace) => {
    setSelectedOption(selectedPlace);

    const filteredEvents = events.filter(
      (event) => event.placeName === selectedPlace
    );
    setEvents(filteredEvents);
  };

  const handleCityFilter = (event) => {
    const selectedCity = event.target.value;
    if (selectedCity === "") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(
        (event) => event.eventCity === eventCities[selectedCity].eventCity
      );
      setEvents(filtered);
    }
  };

  const handleStartDateFilter = (e) => {
    const selectedStartDate = new Date(e.target.value);
    const filteredEvents = events.filter((event) => {
      const eventStartDate = new Date(event.eventStartingDate);
      if (eventStartDate >= selectedStartDate) {
        setEvents(filteredEvents);
      }
    });
  };

  const handleEndDateFilter = (e) => {
    const selectedEndDate = new Date(e.target.value);
    const filteredEvents = events.filter((event) => {
      const eventEndDate = new Date(event.eventStartingDate);
      if (eventEndDate <= selectedEndDate) {
        setEvents(filteredEvents);
      }
    });
  };

  return (
    <div className="grid-container">
      <div className="header">
        <Carousel
          interval={3000}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
        >
          {popularEvents.map((event) => (
            <div key={event.EventId}>
              <img src={event.eventImageUrlOne} className="img-top" />
              <div className="homepage-card-event">
                <h1>{event.eventTitle}</h1>
                <br />
                <p className="location">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    style={{ color: "#555555", marginRight: 10 }}
                  />
                  {event.eventCity}
                </p>
                <p>
                  <FontAwesomeIcon
                    icon={faCalendar}
                    style={{ color: "#000000", marginRight: 10 }}
                  />
                  {new Date(event.eventStartingDate).toLocaleDateString(
                    "tr-TR"
                  )}
                  {" - "}
                  {new Date(event.eventEndDate).toLocaleDateString("tr-TR")}
                </p>
                <button
                  onClick={() => navigate(`etkinlik/${event.EventId}`)}
                  style={{ cursor: "pointer" }}
                >
                  DETAYLAR
                </button>
              </div>
            </div>
          ))}
        </Carousel>

        <div className="homepage-navbar">
          <Link to={"/"}>sonbilet</Link>
          <form style={{ display: "inline" }}>
            <input
              id="search-box"
              type="text"
              placeholder="   Etkinlik, Kişi veya Grup Ara... "
              onChange={(e) => search(e.target.value)}
            />
            <span id="search-icon">
              <i className="fa-solid fa-magnifying-glass fa-sm" />
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </span>
          </form>
          <div id="virtual-div" />
        </div>
        <div className="under-navbar">
          <div className="under-navbar-item">
            <select id="select-city">
              <option value="">Şehir</option>
              {eventCities.map((event, index) => (
                <option value={index} onChange={handleCityFilter}>
                  {event.eventCity}
                </option>
              ))}
            </select>
          </div>
          <div className="under-navbar-item">
            <form action="/action_page.php">
              <label htmlFor="birthday">Başlangıç Tarihi:</label>
              <input type="date" onChange={handleStartDateFilter} />
            </form>
          </div>
          <div className="under-navbar-item">
            <form action="/action_page.php">
              <label htmlFor="birthday">Bitiş Tarihi:</label>
              <input type="date" onChange={handleEndDateFilter} />
            </form>
          </div>
        </div>
      </div>
      <div className="menu">
        <div className="btn-group">
          <button
            style={{
              backgroundColor: "#3498db",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => restartCategory()}
          >
            Kategori
          </button>
          {events.map((event) => (
            <button
              key={event.id}
              className={
                selectedCategory === event.eventCategory ? "active" : ""
              }
              onClick={() => filterEventsByCategory(event.eventCategory)}
            >
              {event.eventCategory}
            </button>
          ))}
        </div>
        <br />
        <div className="switcher">
          <div style={{ color: "#555555" }}>Ücretsiz</div>
          <label className="switch">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleSwitchChange}
            />
            <span className="slider round" />
          </label>
        </div>
        <br />
        <h2>Mekan</h2>
        <br />
        <div className="btn-group">
          {placeNames.map((place) => (
            <div key={place.id} style={{ textAlign: "left" }}>
              <input
                type="radio"
                id={place.id}
                name="place"
                value={place.placeName}
                checked={selectedOption === place.placeName}
                onChange={() => handleRadioChange(place.placeName)}
              />
              <label style={{ marginLeft: "10px" }}>{place.placeName}</label>
            </div>
          ))}

          <button
            onClick={handleReset}
            style={{
              marginTop: "15px",
              borderTopRightRadius: "15px",
              borderTopLeftRadius: "10px",
              backgroundColor: "#555555",
              color: "white",
              textAlign: "center",
            }}
          >
            Mekan Sıfırla
          </button>
        </div>
      </div>
      <div className="main">
        <div className="card-group">
          {events.map((event) => (
            <Link to={`etkinlik/${event.EventId}`}>
              <div
                className="homepage-card"
                key={event.eventId}
                style={{ backgroundImage: `url(${event.eventImageUrlOne})` }}
              >
                <strong>{event.eventTitle}</strong>
                <p>{event.eventCity}</p>
                <p>#{event.eventCategory}</p>
                <span className="card-footer">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    size="sm"
                    style={{ marginLeft: 10, marginRight: 10 }}
                  />
                  {new Date(event.eventStartingDate).toLocaleDateString(
                    "tr-TR"
                  )}
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    size="sm"
                    style={{ marginLeft: 10, marginRight: 10 }}
                  />
                  {event.placeName}
                  <FontAwesomeIcon
                    icon={faTag}
                    size="sm"
                    style={{ marginLeft: 10, marginRight: 10 }}
                  />
                  {event.eventPrice}₺
                </span>
              </div>
            </Link>
          ))}

          {/* Pagination */}
        </div>
      </div>
      <div className="right">
        <h2>Yaklaşan Etkinlikler</h2>
        <br />
        <br />
        <div className="events-slider">
          {upcomingEvents.map((event, index) => (
            <div className="events-slider-item" key={index}>
              <Link to={`etkinlik/${event.EventId}`}>
                <img src={event.eventImageUrlOne} />
                <div className="events-slider-item-text">
                  {event.eventTitle.split(" ").slice(0, 2).join(" ")}{" "}
                </div>
                <div className="events-slider-item-date">
                  {formatDate(event.eventStartingDate)}
                </div>
              </Link>
            </div>
          ))}
        </div>

        <br />
        <br />
        <h2>Geçmiş Etkinlikler</h2>
        {pastEvents.length === 0 ? (
          <div>
            <h3>
              <br></br>Geçmiş etkinlik bulunmamaktadır.
            </h3>
          </div>
        ) : (
          <div>
            <br />
            <br />
            <div className="events-slider">
              <div className="events-slider-item">
                <a style={{ cursor: "pointer" }} onClick={handlePrevSlide}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </a>
              </div>
              {pastEvents.map((event, index) => (
                <div
                  className={`events-slider-item ${
                    index === currentIndex ? "active" : ""
                  }`}
                  key={index}
                >
                  <Link to={`etkinlik/${event.EventId}`}>
                    <img src={event.eventImageUrlOne} />
                    <div className="events-slider-item-text">
                      {event.eventTitle}
                    </div>
                    <div className="events-slider-item-date">
                      {formatDate(event.eventEndDate)}
                    </div>
                  </Link>
                </div>
              ))}
              <div className="events-slider-item">
                <a style={{ cursor: "pointer" }} onClick={handleNextSlide}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="homepage-footer">
        <div id="homepage-footer">
          <a href="index.html">sonbilet</a>
          <div id="virtual-div-footer" />
          <div />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
