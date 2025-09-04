import axios from "axios";
import { React, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Keyboard, Pagination, Autoplay } from "swiper";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const OfferBanner = ({ clickedId }) => {
  const [offerData, setOfferData] = useState([]);
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get(
          `/campaign/getcampaign`
        );
        console.log({ response });
        const offerDataRes = response.data

        if (clickedId) {
          const filteredOfferData = offerDataRes.filter((ele) => ele && ele.id === clickedId)
          // console.log({ filteredOfferData })
          setOfferData(filteredOfferData);
        } else {

          setOfferData(offerDataRes);
        }
      } catch (err) {
        console.error(err);
      } finally {
      }
    };

    fetchData();
  }, []);

  const handleSelectOffer = async (offerId) => {
    // alert(offerId);
    navigate('/offersale', { state: offerId })

    // try {
    //   const response = await axiosPrivate.post(`campaign/singlecampaign`,{campaign_id:offerId});
    //   console.log(response);
    // } catch (err) {
    //   console.error(err)
    // } finally {
    // }
  };
  console.log({ offerData });
  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        keyboard={{
          enabled: true,
        }}
        autoplay={{
          delay: 2800,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Keyboard, Pagination, Autoplay]}
        className="mySwiper"
        style={{ height: "90%", overflow: "hidden", position: "relative" }}
      >
        {offerData.map((ele, index) => (
          <SwiperSlide key={index}>
            <img
              title={ele?.name}
              onClick={() => handleSelectOffer(ele?.id)}
              style={{ objectFit: "contain" }}
              src={"./assets/bn.jpg"}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default OfferBanner;
