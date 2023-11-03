import React, { useEffect, useState } from 'react';
import './component.css';

function Simulateur() {
  const listeAttaque = [
    {
      type: "Red",
      pts: 20
    },
    {
      type: "Blue",
      pts: 10
    },
    {
      type: "Ultimate",
      pts: 50
    }
  ];

  const [infoPlayerOne, setinfoPlayerOne] = useState({
    maxPV: 150,
    currentPV: 150
  });

  const [infoPlayerTwo, setinfoPlayerTwo] = useState({
    maxPV: 150,
    currentPV: 150
  });

  const [gameOver, setGameOver] = useState(false);

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

  const [showMissImage, setShowMissImage] = useState(false);

    function missHandler(redDamage, blueDamage, ultimateDamage, damageIa1, damageIa2, damageIa3) {
      if (redDamage === 0 || blueDamage === 0 || ultimateDamage === 0 || 
        damageIa1 === 0 || damageIa2 === 0 || damageIa3 === 0 ) {
        setShowMissImage(true);
        setTimeout(() => setShowMissImage(false), 3000);
      }
  }
    
  const [errorMessage, setErrorMessage] = useState(false);
  const [showDamage, setShowDamage] = useState(false);

    function damageCounter(redDamage, blueDamage, ultimateDamage) {
      if (redDamage || blueDamage || ultimateDamage)  {
        setShowDamage("Sukuna s'est pris: " + (redDamage || blueDamage || ultimateDamage) + " de dégâts")
        setTimeout(() => setShowDamage(false), 3000);
      }
    }

    const [showDamageIa, setShowDamageIa] = useState();
    
    function damageCounterIa(damageIa1, damageIa2, damageIa3) {
      if (damageIa1 || damageIa2 || damageIa3) {
        setShowDamageIa("Gojo s'est pris: " + (damageIa1 || damageIa2 || damageIa3) + " de dégâts")
        setTimeout(() => setShowDamageIa(false), 3000);
      }
    }

  const [isUltimateImageVisible, setIsUltimateImageVisible] = useState(false);

    function attackHandler(attackType) {
        if (gameOver) {
        return;
        }

        const newObj = { ...infoPlayerTwo };
        const rctCure = { ...infoPlayerOne };

        let redDamage, blueDamage, ultimateDamage;

        switch (attackType) {
        case "Red":
            redDamage = getRandomInt(10)
            newObj["currentPV"] -= redDamage;
            setSkillUsageCount({ ...skillUsageCount, Red: skillUsageCount.Red + 1 });
            console.log(skillUsageCount)
            break;
        case "Blue":
            blueDamage = getRandomInt(5)
            newObj["currentPV"] -= blueDamage;
            setSkillUsageCount({ ...skillUsageCount, Blue: skillUsageCount.Blue + 1 });
            break;
        case "Ultimate":
            if (
              (skillUsageCount.Red >= 2 && skillUsageCount.Blue >= 1) ||
              (skillUsageCount.Red >= 1 && skillUsageCount.Blue >= 2) ||
              (skillUsageCount.Red >= 3) || (skillUsageCount.Blue >= 3)
            ) {
              ultimateDamage = getRandomInt(50)
              newObj["currentPV"] -= ultimateDamage;
              setIsUltimateImageVisible(true);

              setTimeout(() => {
                setIsUltimateImageVisible(false);
              setSkillUsageCount({
            ...skillUsageCount,
            Ultimate: skillUsageCount.Ultimate + 1,
            Red: 0,
            Blue: 0,
          });
        }, 3000);
      } else {
        setErrorMessage(true);
        setTimeout(() => setErrorMessage(false), 3000);
      }
      break;
        }
        setinfoPlayerTwo(newObj);
        setinfoPlayerOne(rctCure);
        iaAttack();
        hpZero(newObj);
        missHandler(redDamage, blueDamage, ultimateDamage)
        damageCounter(redDamage, blueDamage, ultimateDamage)
    }

    function iaAttack() {
        if (gameOver) {
        return;
        }

        const newObj2 = { ...infoPlayerOne };
        const rctCure2 = { ...infoPlayerTwo };

        const playerTwoAttack = Math.round(Math.random() * 3);
        let damage = 0;
        let damageIa1, damageIa2, damageIa3;

        switch (playerTwoAttack) {
        case 0:
            damageIa1 = getRandomInt(10)
            newObj2["currentPV"] -= damageIa1;
            break;
        case 1:
            damageIa2 = getRandomInt(5)
            newObj2["currentPV"] -= damageIa2;
            break;
        case 2:
            damageIa3 = getRandomInt(20)
            newObj2["currentPV"] -= damageIa3;
            break;
        }

        newObj2["currentPV"] -= damage;
        rctCure2["currentPV"] += damage;
        setinfoPlayerOne(newObj2);
        hpZero(newObj2);
        missHandler(damageIa1, damageIa2, damageIa3)
        damageCounterIa(damageIa1, damageIa2, damageIa3)
    }

    function hpZero(newObj, newObj2) {
        if (newObj && newObj.currentPV < 0) {
            newObj.currentPV = 0;
        }
        if (newObj2 && newObj2.currentPV < 0) {
            newObj2.currentPV = 0;
        }
    }
    
    function resetButton() {
        if (infoPlayerOne.currentPV <= 0 || infoPlayerTwo.currentPV <= 0) {
            setinfoPlayerOne({maxPV: 150, currentPV: 150});
            setinfoPlayerTwo({maxPV: 150, currentPV: 150});
            setGameOver(false)
        }
    }

    useEffect(() => {
        if (infoPlayerOne.currentPV <= 0 || infoPlayerTwo.currentPV <= 0) {
          setGameOver(true);
        }
      }, [infoPlayerOne.currentPV, infoPlayerTwo.currentPV]);
    
    const attackImages = {
      "Red": './img/red.png',
      "Blue": './img/blue.png',
      "Ultimate": './img/ultimate.png',
    }

    function getImageClass() {
      return gameOver ? "image-disabled" : "";
    }

    const [skillUsageCount, setSkillUsageCount] = useState({
      Red: 0,
      Blue: 0,
      Ultimate: 0,
    });

  return (
    <div>
      <img class="jjklogo" src="./img/Jujutsu_Kaisen_logo.png" alt="jjk logo"/>
      <div className="gojoPV">{infoPlayerOne.currentPV}/{infoPlayerOne.maxPV}</div>
      <div className="sukunaPV">{infoPlayerTwo.currentPV}/{infoPlayerTwo.maxPV}</div>
      {isUltimateImageVisible && (
      <img
        src={'./img/gojohollow.webp'}
        alt="Ultimate"
        className={`translated-image ${getImageClass()}`}
      />
      )}
      {listeAttaque.map((attack, index) => (
        <img
          src={attackImages[attack.type]}
          key={index}
          onClick={() => attackHandler(attack.type)}
          disabled={gameOver}
          {...attack.type}
          className={getImageClass()}
        />
      ))}
      <div className={'damageshowtwo'}>{showDamage}</div>
      <div className={'damageshowone'}>{showDamageIa}</div>
      <img class="gojo" src="../img/Satoru_Gojo.webp" alt="gojo"/>
      <img class="sukuna" src="./img/Sukuna.webp"/>
      <div>
        {infoPlayerTwo.currentPV <= 0 ? 
          <>
          <br/>
          <div class="victorymsg">You win!!</div>
          <button className="resetbutton" onClick={resetButton}>Reset</button>
          </> : null}
        
        {infoPlayerOne.currentPV <= 0 ? 
          <>
          <br/>
          <div class="victorymsg">You lose!!</div>
          <br/>
          <button className="resetbutton" onClick={resetButton}>Reset</button>
          </> : null}
        {showMissImage && <div className="missmsg">Miss</div>}
        {errorMessage && <div className="yujimsg"><img src="./img/yujimsg.png" alt="errormsg"/></div>}
      </div>
    </div>
  );
}


export default Simulateur;