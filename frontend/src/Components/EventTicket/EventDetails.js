import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Carousel } from 'react-bootstrap'
import MetaData from '../Layout/MetaData'
import { getUser, getToken, successMsg, errMsg } from '../../utils/helpers'
import axios from 'axios'



const EventDetails = ({ addItemToCart, cartItems }) => {

    const [loading, setLoading] = useState(true)
    const [event, setEvent] = useState({})
    const [error, setError] = useState('')
    const [quantity, setQuantity] = useState(0)
    const [user, setUser] = useState(getUser())
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const [success, setSuccess] = useState('')


    let { id } = useParams()
    // const alert = useAlert();

    const eventDetails = async (id) => {
        let link = `http://localhost:4001/api/v1/event/${id}`
        console.log(link)
        let res = await axios.get(link)
        console.log(res)
        if (!res)
            setError('Event not found')
        setEvent(res.data.event)
        setLoading(false)
    }

    const addToCart = async () => {
        await addItemToCart(id, quantity);
    }

    useEffect(() => {
        eventDetails(id)

    }, [id, error, success]);

    localStorage.setItem('cartItems', JSON.stringify(cartItems))

    return (
        <Fragment>

                <Fragment>
                    <MetaData title={event.name} />
                    <div className="row d-flex justify-content-around">
                        <div className="col-12 col-lg-5 img-fluid" id="product_image">
                            <Carousel pause='hover'>
                                {event.images && event.images.map(image => (
                                    <Carousel.Item key={image.public_id}>
                                        <img className="d-block w-100" src={image.url} alt={event.title} />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </div>

                        <div className="col-12 col-lg-5 mt-5">
                            <h3>{event.name}</h3>
                            <p id="product_id">Event # {event._id}</p>

                            <hr />

                            <p id="product_price">
  {event.tickets && event.tickets.length > 0
    ? `$${event.tickets[0].price}`
    : 'No price available'}
</p>
<button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4" onClick={addToCart}>
  Add to Cart
</button>
                            <h4 className="mt-2">Description:</h4>
                            <p>{event.description}</p>
                            <hr />

                          </div>    
                          </div>              
                </Fragment>

        </Fragment>


    )}
export default EventDetails