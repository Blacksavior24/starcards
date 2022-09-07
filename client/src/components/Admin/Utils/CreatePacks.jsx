import React from "react";
import { useState } from "react";
import { storage } from "../../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import createPackCardsAdmin from "./../../../redux/actions/admin/cardPacksMod";
import getAllCards from "./../../../redux/actions/cards/getAllCards";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useRef } from "react";
import style from "./CreatePacks.module.css";

function CreatePacks() {
  //packs
  const name2 = useRef(null);
  const price = useRef(null);
  const amount = useRef(null);
  const stock = useRef(null);
  async function uploadFilePack(file, name) {
    const storageRef = ref(storage, `packs/${name}`); //nombre de ref para la subida
    await uploadBytes(storageRef, file); //subida del archivo
    const url = await getDownloadURL(storageRef); //la url de la subida
    return url;
  }

  const dispatch = useDispatch();
  const allcards = useSelector((state) => state.album.cards);

  useEffect(() => {
    dispatch(getAllCards());
  }, [dispatch]);

  //hooks
  const [file, setFile] = useState(null);
  //packs
  const [errors, setErrors] = useState(null);

  const [input, setInput] = useState({
    name: "",
    price: "",
    race: "",
    cards: [],
    // percent: [],
    stock: "",
    image: null,
    amount: "",
  });

  const handleChange = (e) => {
    let name = name2.current.value;
    setErrors("");
    if (name) {
      if (/^[A-Z]+$/i.test(name)) {
        setInput({
          ...input,
          [e.target.name]: e.target.value,
        });
      } else {
        setErrors("solo letras");
      }
    } else {
      setInput({
        ...input,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSelectRace = (e) => {
    if (input.race.includes(e.target.value)) {
      alert("Otra raza");
    } else {
      setInput({
        ...input,
        race: e.target.value,
      });
    }
  };

  const handleSelectCards = (e) => {
    if (!input.cards.includes(e.target.value)) {
      setInput({
        ...input,
        cards: [...input.cards, [e.target.value]],
      });
    }
  };

  const handleSubmitPack = async (e) => {
    e.preventDefault();

    try {
      if (!errors) {
        const result = await uploadFilePack(file, input.name); //obteninedo la url con el nombre
        input.image = result; //obteniendo en el input.image el url
        const valorespack = input;
        // valorespack.percent = valorespack.percent.map((perce) => perce / 100); //división a 100

        // for (let i = 0; i < valorespack.percent.length; i++) {
        //   //agregado el porcentaje
        //   valorespack.cards[i].push(valorespack.percent[i]);
        // }
        // valorespack.percent = null; //anulando percent
        console.log(valorespack);
        dispatch(createPackCardsAdmin(valorespack));
        setInput({
          name: "",
          price: "",
          race: "",
          cards: [],
          percent: [],
          stock: "",
          image: null,
          amount: "",
        });
      } else {
        alert("Name incorrect");
      }
    } catch (error) {
      alert("Retry");
    }
  };

  const handleDelete = (e) => {
    setInput({
      ...input,
      cards: input.cards.filter((card) => card !== e),
    });
  };

  return (
    <>
      <div className={style.container}>
        <h1>New Pack</h1>
        <form onSubmit={handleSubmitPack}>
          <input
            type="text"
            name="name"
            onChange={(e) => handleChange(e)}
            placeholder="Name pack"
            required
            ref={name2}
            min="5"
          />
          {errors && <p>{errors}</p>}
          <input
            type="number"
            name="price"
            min="1"
            max="3000"
            onChange={(e) => handleChange(e)}
            placeholder="Precio"
            required
            ref={price}
          />
          <input
            type="number"
            name="amount"
            onChange={(e) => handleChange(e)}
            placeholder="Amount"
            required
            ref={amount}
            min="1"
          />
          <input
            type="number"
            name="stock"
            onChange={(e) => handleChange(e)}
            placeholder="stock"
            required
            ref={stock}
            min="1"
          />
          <div>
            <label>Race: </label>
            <select onChange={(e) => handleSelectRace(e)} required>
              <option hidden={true} key="raza"></option>
              <option value="Zerg" key="Zerg">
                Zerg
              </option>
              <option value="Terran" key="Terran">
                Terran
              </option>
              <option value="Protoss" key="Protoss">
                Protoss
              </option>
            </select>
          </div>
          <div>
            <label>Select one option: </label>
            <select
              onChange={(e) => {
                handleSelectCards(e);
              }}
              required
            >
              <option hidden={true} key="option"></option>
              {allcards?.map((e) => {
                return (
                  <option value={e.name} key={e.id}>
                    {e.name}
                  </option>
                );
              })}
            </select>
          </div>

          <input
            type="file"
            name=""
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button>Create</button>

          <div>
            {input.cards?.map((e) => {
              return (
                <div key={e}>
                  <p>{e}</p>
                  <button
                    onClick={() => {
                      handleDelete(e);
                    }}
                  >
                    x
                  </button>
                </div>
              );
            })}
          </div>
        </form>
      </div>
    </>
  );
}

export default CreatePacks;
