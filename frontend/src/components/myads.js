import React, { useEffect, useState } from "react";
import {Link, useHistory} from "react-router-dom";

import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import Logo from "../images/bairsLogoP.svg";
import "../styles/components/myads.css";
import api from "../services/api";


function MyAds() {
  const userId = parseInt(localStorage.getItem("userId"));
  const [ads, setAds] = useState([]);
  const [images, setImages] = useState([]);

  const history = useHistory();

  useEffect(() => {
    async function loaddata() {
      await api
        .get("/images", {
          headers: {
            Authorization: userId,
          },
        })
        .then((response) => {
          setImages(response.data);
        });
    }
    loaddata();
  }, [userId]);

  useEffect(() => {
    async function loaddata() {
      await api
        .get("/products", {
          headers: {
            Authorization: userId,
          },
        })
        .then((response) => {
          setAds(response.data);
        });
    }
    loaddata();
  }, [userId]);

  async function handleDelete(id) {
    let response = window.confirm("Tem certeza que quer EXCLUIR O ANUNCIO?");
    if (response === true) {

      console.log(id);
      console.log(userId);
      await api.delete(`/product/delete/${id}`, {
        headers: {
          Authorization: userId,
        },
      });
      alert("Anuncio deletado com sucesso");
      history.push(`/dashboard/${userId}`);
    }
  }

  return (
    <div>
      <div className="myads__list">
      <h2 className="myads__filter">#Meus anúncios</h2>
      {ads.map((ad) =>
        ad.user_id === userId ? (
          <div key={ad.id} className="myads__container">
            <Link to={`/advert/${ad.id}`}>
            <div className="myads__wrapper--image">
              {images.map((image) =>
                image.product_id === ad.id ? (
                  <div key={image.id} className="myads__photo">
                    <img
                      src={`http://localhost:3333/files/images/${image.path}`}
                      alt="Foto do anuncio"
                    />
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
            </Link>
            <div className="myads__name">
              <h3 className="myads__name--title">{ad.title}</h3>
              <p>{ad.description}</p>
            </div>
            <div className="myads__price">
              <h3>{`R$ ${ad.price}`}</h3>
            </div>
            <div className="myads__actions">
              <div className="myads__actions--edit">
                <Link to={`/edit/${ad.id}`} className="myads__button--edit">
                  <label className="myads__lbl--edit">Editar</label>
                  <FiEdit />
                </Link>
              </div>
              <div className="myads__actions--delete">
                <button
                  className="myads__button--delete"
                  onClick={() => handleDelete(ad.id)}
                >
                  <label className="myads__lbl--delete">Excluir</label>
                  <MdDelete />
                </button>
              </div>
            </div>
          </div>
        ) : (
            ""
        )
      )} 
      </div>
    </div>
  );
}

export default MyAds;
