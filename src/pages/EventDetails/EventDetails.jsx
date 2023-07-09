import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// import "./style/EventDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

function EventDetails() {
  const [event, setEvent] = useState({});
  const [eventAddress, setEventAddress] = useState("");
  const [eventPlace, setEventPlace] = useState("");
  const [eventPlaceReplace, setEventPlaceReplace] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [price, setPrice] = useState("");
  const [defaultImageUrl, setDefaultImageUrl] = useState(
    "https://img.freepik.com/premium-vector/cartoon-cashier-selling-tickets-movie-theatre-ticket-seller-counter-box-office-flat-vector-illustration-entertainment-cinema-advertising-concept-banner-website-design-landing-page_74855-21687.jpg"
  );

  const [formDataCustomer, setFormDataCustomer] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    city: "",
    age: "",
  });

  const apiKey = process.env.API_KEY;

  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`http://localhost:5022/api/Event/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => console.log(err));
    axios
      .get(`http://localhost:5022/api/Event/event-address/${id}`)
      .then((res) => setEventAddress(res.data))
      .catch((err) => console.log(err));
    axios
      .get(`http://localhost:5022/api/Event/place-name/${id}`)
      .then((res) => setEventPlace(res.data))
      .catch((err) => console.log(err));
  });

  useEffect(() => {
    setEventPlaceReplace(eventPlace.replace(" ", "+"));
  }, [eventPlace]);

  const handleTicketTypeChange = (e) => {
    const selectedTicketType = e.target.value;
    setTicketType(selectedTicketType);
    calculatePrice(selectedTicketType);
  };

  const calculatePrice = (ticketType) => {
    if (ticketType === "0") {
      setPrice("Ücretsiz");
    } else if (ticketType === "1") {
      setPrice(`${event.eventPrice * 0.75} ₺`);
    } else if (ticketType === "2") {
      setPrice(`${event.eventPrice} ₺`);
    } else if (ticketType === "3") {
      setPrice(`${event.eventPrice * 1.25} ₺`);
    } else if (ticketType === "4") {
      setPrice(`${event.eventPrice * 4} ₺`);
    } else {
      setPrice("");
    }
  };

  const navigate = useNavigate();

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=https://http://localhost:3000/etkinlik/${id}`;
  const instagramUrl = `https://www.instagram.com/share?url=http://localhost:3000/etkinlik/${id}`;

  const handleSubmit = (e) => {
    e.preventDefault();

    const customerData = {
      CustomerName: formDataCustomer.firstname,
      CustomerSurname: formDataCustomer.lastname,
      CustomerEmail: formDataCustomer.email,
      CustomerPhone: formDataCustomer.phone,
      CustomerCity: formDataCustomer.city,
      CustomerAge: formDataCustomer.age,
    };

    const ticketData = {
      CustomerId: 0,
      EventId: event.eventId,
      TicketType: parseInt(ticketType),
      TicketPurchaseDate: new Date(),
      TicketPrice: parseFloat(event.eventPrice),
    };

    axios
      .all([
        axios.post("http://localhost:5022/api/Customer", customerData),
        axios.post("http://localhost:5022/api/Ticket", ticketData),
      ])
      .then(
        axios.spread((customerResponse, ticketResponse) => {
          console.log("Customer response:", customerResponse.data);
          console.log("Ticket response:", ticketResponse.data);
        })
      )
      .catch((error) => {
        alert.error(error);
      });
  };

  return (
    <>
      <div className="eventdetails-navbar">
        <Link to="/">sonbilet</Link>
        <div>{/*Sanal Div*/}</div>
      </div>
      <div className="container">
        <div className="row" id="row-event-details" key={event.eventId}>
          <div className="col" id="col-description">
            <h1>{event.eventTitle}</h1>
            <h2>
              {new Date(event.eventStartingDate).toLocaleDateString("tr-TR")}
              {" - "}
              {new Date(event.eventEndDate).toLocaleDateString("tr-TR")}
            </h2>
            <h3>Açıklama</h3>
            <p>{event.eventDescription}</p>
            <h3>Bilet Seçenekleri</h3>
            <div className="row">
              <h4>Tam bilet: {event.eventPrice} ₺</h4>
              <h4>Öğrenci: {event.eventPrice * 0.75} ₺</h4>
              <h4>Premium: {event.eventPrice * 1.25} ₺</h4>
              <h4>VIP: {event.eventPrice * 4} ₺</h4>
            </div>
          </div>
          <div className="col" id="img-top-col">
            <Carousel
              interval={3000}
              infiniteLoop={true}
              delay={0}
              slidesToShow={3}
              slidesToScroll={1}
              touchMove={true}
              width={500}
              height={300}
              showThumbs={false}
              showStatus={false}
            >
              <div key={0}>
                {event.eventImageUrlOne !== "" ? (
                  <img src={event.eventImageUrlOne} className="img-top" />
                ) : (
                  <img src={defaultImageUrl} className="img-top" />
                )}
              </div>
              <div key={1}>
                {event.eventImageUrlTwo !== "" ? (
                  <img src={event.eventImageUrlTwo} className="img-top" />
                ) : (
                  <img src={defaultImageUrl} className="img-top" />
                )}
              </div>
              <div key={2}>
                {event.eventImageUrlThree !== "" ? (
                  <img src={event.eventImageUrlThree} className="img-top" />
                ) : (
                  <img src={defaultImageUrl} className="img-top" />
                )}
              </div>
            </Carousel>
            <div id="hashtag">
              <div className="hashtag-item"># {event.eventCategory}</div>
              <div className="hashtag-item"># {event.eventCity}</div>
              <div className="hashtag-item">
                <Link to={instagramUrl} target="_blank">
                  Paylaş
                  <FontAwesomeIcon
                    icon={faInstagram}
                    style={{ marginLeft: 5 }}
                  />
                </Link>
              </div>
              <div className="hashtag-item">
                <Link to={facebookUrl} target="_blank">
                  Paylaş
                  <FontAwesomeIcon
                    icon={faFacebook}
                    style={{ marginLeft: 5 }}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${eventPlaceReplace}`}
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              id="maps-address"
            ></iframe>

            <div className="col" id="address">
              <h2>{eventPlace}</h2>
              {eventAddress}
            </div>
          </div>
          <div className="col">
            <h2>Bilet Ayırt</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="fname">İsim</label>
              <input type="text" id="fname" required="" />
              <label htmlFor="lname">Soyisim</label>
              <input type="text" id="lname" required="" />
              <label htmlFor="email">E-posta</label>
              <input type="text" id="email" required="" />
              <label htmlFor="phone">Telefon</label>
              <input
                type="tel"
                id="phone"
                pattern="^\+?[0-9]{12}$"
                required=""
              />
              <small>Örnek: +905551234567</small>
              <br />
              <br />
              <label htmlFor="city">Şehir</label>
              <input type="text" id="city" required="" />
              <label htmlFor="age">Yaş</label>
              <input type="number" id="age" required="" />
              <label htmlFor="event">Etkinlik</label>
              <input
                type="text"
                id="event"
                name="event"
                value={event.eventTitle}
                readOnly=""
              />
              <label htmlFor="ticket-type">Bilet Türü</label>
              <select
                id="ticket-type"
                name="ticket-type"
                required=""
                value={ticketType}
                onChange={handleTicketTypeChange}
              >
                <option value="">Bilet Türünü Seçin</option>
                <option value="0">Ücretsiz</option>
                <option value="1">Öğrenci</option>
                <option value="2">Tam</option>
                <option value="3">Premium</option>
                <option value="4">VIP</option>
              </select>
              <label htmlFor="price">Fiyat</label>
              <input
                type="text"
                id="price"
                name="price"
                value={price}
                readOnly=""
              />
              <label htmlFor="date">Rezervasyon Tarihi</label>
              <input
                type="text"
                id="date"
                name="date"
                value={new Date().toLocaleDateString("tr-TR")}
                readOnly
              />
              <button id="btn-ticket" type="submit">
                Bilet Ayırt
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="eventdetails-footer">
        <a href="index.html">sonbilet</a>
        <div id="virtual-div-footer" />
        <div />
      </div>
    </>
  );
}

export default EventDetails;
