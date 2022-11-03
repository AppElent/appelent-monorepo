import React, {useEffect, useState} from 'react'
import './App.css';
import { Card, CardContent, CardActions, Grid, Button, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Avatar, Box, LinearProgress } from '@mui/material'
import InsertChartIcon from '@mui/icons-material/InsertChartOutlined';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics  } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnu3jxh0nvDHj1yzZQjrjmtdDaZqI78Xg",
  authDomain: "appelent-wappiemeter.firebaseapp.com",
  projectId: "appelent-wappiemeter",
  storageBucket: "appelent-wappiemeter.appspot.com",
  messagingSenderId: "870239103094",
  appId: "1:870239103094:web:27f85c41ec642e7d96d757",
  measurementId: "G-5Y8RJX84YF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

const questions = [
  {
    type: 'regular',
    question: 'Hoe heet de prik die doorgaans in je bovenarm gezet wordt op de vaccinatielocatie?',
    answers: [
      {
        answer: 'VacciNAZI',
        score: 50
      },{
        answer: 'Vaccinatie',
        score: 0
      },{
        answer: 'OMG DAT IS WAT MSM WIL DAT JE DENKT!!1!',
        score: 100
      }
    ]
  },{
    type: 'regular',
    question: 'Waarom zou je een vaccinatie nemen?',
    answers: [
      {
        answer: 'Waarom niet?',
        score: 0
      },{
        answer: 'Er is keihard bewijs dat vaccinaties dodelijk zijn',
        score: 75
      },{
        answer: 'ER ZIJN WERELDWIJD MILJOEN MENSEN DOOD NEERGEVALLEN NA DE PRIK',
        score: 75
      },{
        answer: 'OMG DAT IS WAT MSM WIL DAT JE DENKT!!1!',
        score: 100
      }
    ]
  },{
    type: 'regular',
    question: 'Welke van onderstaande is het meest betrouwbaar om ons informatie te geven over corona?',
    answers: [
      {
        answer: 'Een salsaleraar',
        score: 75
      },{
        answer: 'Een kabouter',
        score: 50
      },{
        answer: 'Een viroloog',
        score: 0
      },{
        answer: 'OMG DAT IS WAT MSM WIL DAT JE DENKT!!1!',
        score: 100
      }
    ]
  },{
    type: 'regular',
    question: 'Hoeveel is 1+1?',
    answers: [
      {
        answer: '2',
        score: 0
      },{
        answer: 'Hangt ervan af wie het zegt',
        score: 75
      },{
        answer: 'Het is de schuld van de buitenlanders',
        score: 50
      },{
        answer: 'OMG DAT IS WAT MSM WIL DAT JE DENKT!!1!',
        score: 100
      }
    ]
  },{
    type: 'regular',
    question: 'Als je het laatste nieuws over corona zoekt. Waar zoek je dan?',
    answers: [
      {
        answer: 'RTL/NOS',
        score: 0
      },{
        answer: '2 jaar "ZeLluF oNdErZoEk DoEn!!"',
        score: 100
      },{
        answer: 'Feesboek',
        score: 75
      },{
        answer: 'Joetoep',
        score: 75
      }
    ]
  },{
    type: 'regular',
    question: 'Wat is het doel van de vaccinatiecampagne?',
    answers: [
      {
        answer: 'Vaccineren helpt niet!',
        score: 20
      },{
        answer: 'Ons allemaal VERMOORDEN',
        score: 90
      },{
        answer: 'Ons helpen bevrijden uit de pandemie',
        score: 0
      },{
        answer: 'Ons implanteren met een chip zodat we robots worden',
        score: 100
      }
    ]
  },{
    type: 'regular',
    question: 'Wat vind je van de QR code?',
    answers: [
      {
        answer: 'OMG GRONDWET VRIJHEID',
        score: 100
      },{
        answer: 'Wat nodig is, is nodig.. helaas',
        score: 0
      },{
        answer: 'Ik vind de QR code inmiddels onnodig en too much, maar ik snap wel dat deze er was',
        score: 0
      },{
        answer: 'Het is bedoeld om ons te tracken!!',
        score: 90
      }
    ]
  },{
    type: 'regular',
    question: 'Wat vind je van de gebeurtenissen bij TVOH?',
    answers: [
      {
        answer: 'Daders moeten gestraft worden en ik heb te doen met de slachtoffers',
        score: 0
      },{
        answer: 'Het is alleen maar een afleidingsmanoeuvre om de plannen van Schwab te bedekken',
        score: 90
      },{
        answer: 'Heel erg maar #QRankzinnigheid vind ik erger',
        score: 30
      },{
        answer: 'DAT IS WAT MSM WIL DAT JE DENKT',
        score: 100
      }
    ]
  },{
    type: 'regular',
    image: 'https://afbeelding.dvhn.nl/dvhn/images/36ggg9-img-210122-236.jpg/alternates/LANDSCAPE_1920/img-210122-236.jpg',
    question: 'Wat is het beroep van deze man?',
    answers: [
      {
        answer: 'Kinderverkrachter',
        score: 100
      },{
        answer: 'Minister President',
        score: 0
      }
    ]
  },{
    type: 'regular',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/World_Economic_Forum_logo.svg/1200px-World_Economic_Forum_logo.svg.png',
    question: 'Wat is het WEF?',
    answers: [
      {
        answer: 'Een geheime sekte die het slechtste met de mensheid voor heeft',
        score: 100
      },{
        answer: 'Een economisch genootschap',
        score: 0
      },{
        answer: 'Ik weet het niet maar ik ben bang voor alles wat met economie en politiek te maken heeft',
        score: 50
      }
    ]
  },{
    type: 'regular',
    question: 'Er zijn rellen tijdens een corona demonstratie. Wie veroorzaakt de rellen?',
    answers: [
      {
        answer: 'Laagbegaafde relschoppers',
        score: 0
      },{
        answer: 'De ME',
        score: 100
      },{
        answer: 'Antifa',
        score: 75
      },{
        answer: 'Romeos',
        score: 75
      }
    ]
  },{
    type: 'regular',
    question: 'Als na bijna een jaar blijkt dat door mutaties en minder wordende immuniteit de bescherming van het vaccin minder wordt. Welke conclusie kan je daaruit trekken?',
    answers: [
      {
        answer: 'VACCINATIE IS DODELIJK',
        score: 100
      },{
        answer: 'Ah, dat is balen! Laten we kijken of een extra vaccinatie ons verder gaat helpen',
        score: 0
      },{
        answer: 'Vaccinaties hebben nooit gewerkt!!!',
        score: 75
      }
    ]
  },{
    type: 'regular',
    question: 'Als een wappie tegen je zegt dat je in een angstpsychose zit, wat betekent dat?',
    answers: [
      {
        answer: 'Dat je doodsbang bent gemaakt voor Corona door de overheid',
        score: 100
      },{
        answer: 'Dat hij/zij zelf doodsbang is voor de overheid en de prik, maar dat hij/zij dat niet durft toe te geven',
        score: 0
      }
    ]
  },{
    type: 'regular',
    question: 'Wie is dit jochie?',
    image: 'https://cdn-04.dagelijksestandaard.nl/wp-content/uploads/2021/06/DDS-Kamerleden-028-1132x670.jpg?x24812',
    answers: [
      {
        answer: 'OMG, MIJN HELD, MIJN MESSIAS. Hij durft tenminste écht voor mensen op te komen!',
        score: 100
      },{
        answer: 'Gideon van Meijeren (12)',
        score: 0
      }
    ]
  },{
    type: 'regular',
    question: 'Wie is deze meneer?',
    image: 'https://images.story.nl/BX1OXiUDyTfy20UYbc5c1EmDfPo=/890x0/smart/story.nl/s3fs-public/main_media/hugo_de_jonge_0.png?itok=EjO5-AQY',
    answers: [
      {
        answer: 'Hugo Mengele',
        score: 75
      },{
        answer: 'Hugo de Jonge',
        score: 0
      },{
        answer: 'Hugochenko',
        score: 100
      }
    ]
  },{
    type: 'regular',
    question: 'Hoe check je of een bron reputabel is?',
    image: 'https://images.story.nl/BX1OXiUDyTfy20UYbc5c1EmDfPo=/890x0/smart/story.nl/s3fs-public/main_media/hugo_de_jonge_0.png?itok=EjO5-AQY',
    answers: [
      {
        answer: 'Alles op social media is per definitie waar (behalve als ik het er niet mee eens ben)',
        score: 75
      },{
        answer: 'Check reputatie van site en/of kijk of er bronvermelding is',
        score: 0
      },{
        answer: 'Combinatie van HOOFDLETTERS, spelfouten en het missen van interpunctie.',
        score: 100
      }
    ]
  }
]

const CustomCard = ({title, children, buttonText, buttonAction}) => {
  return (<div className="App">
  <Grid
    container
    spacing={0}
    direction="column"
    alignItems="center"
    justify="center"
    style={{ minHeight: '100vh' }}
  >
  <Card sx={{ width: '100%', maxWidth: 700 }}>
  <CardContent>
    {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
      Word of the Day
    </Typography> */}
    <Typography variant="h5" component="div">
      {title}
    </Typography>
    <Typography variant="body2">
      {children}
    </Typography>
  </CardContent>
  <CardActions>
    <Button variant="contained" size="small" onClick={buttonAction}>{buttonText}</Button>
  </CardActions>
</Card>
</Grid>
</div>)
}

function App() {

  const getRandomItems = () => {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    return selected;
  }

  const [selectedQuestions, setSelectedQuestions] = useState(getRandomItems());
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState(selectedQuestions[currentQuestion].answers[0]);
  const [finished, setFinished] = useState(false);

  const handleChange = (event) => {
    console.log(event.target.value, questions);
    const answerToPick = selectedQuestions[currentQuestion].answers.find(question => question.answer === event.target.value);
    console.log(answerToPick);
    setCurrentAnswer(answerToPick);
  };

  useEffect(() => {
    setCurrentAnswer(selectedQuestions[currentQuestion].answers[0]);
  }, [currentQuestion, selectedQuestions])

  if(!started){
    return (
      <CustomCard title="Wappiemeter 1.0" buttonText="Starten" buttonAction={() => setStarted(true)}>
        Voor eens en voor altijd bepalen of iemand wappie is of niet!
        <br />
        In sommige gevallen popt wel eens de vraag op: wat is een wappie? En het is natuurlijk lastig om daar een goed antwoord op te geven. Deze test laat zien dat het "wappie-zijn" een glijdende schaal is: 
        je kan een beetje wappie zijn, of je kan volledig wappie zijn. In dat laatste geval behoort men dan tot de licht psychotische groep die overal een complot in ziet.
        {<><br /><br /></>}
        Je antwoorden worden niet opgeslagen en je gegevens worden NIET gebruikt. 
        Als je op starten drukt ga je daar dus mee akkoord. Dan moet je dus niet later lopen zeuren dat je antwoorden niet opgeslagen worden ofzo, 
        want je antwoorden worden niet opgeslagen omdat ze niet worden opgeslagen.
        {/* <br />
        {'"a benevolent smile"'} */}
      </CustomCard>
    );
  }

  const setNextQuestion = () => {
    setScore(score => score + currentAnswer.score);
    setCurrentQuestion(currentQuestion + 1)
  }

  const finish = async () => {

    setScore(score => score + currentAnswer.score);
    setFinished(true);
  }

  const startOver = () => {
    setStarted(false);
    setCurrentAnswer(selectedQuestions[0].answers);
    setCurrentQuestion(0);
    setFinished(false);
    setScore(0);
    setSelectedQuestions(getRandomItems());
  }

  //const handleChange = () => {}

  if(finished){
    const totalScore = Math.round(score/500*100)
    const text = 'Ik heb net de %23Wappiemeter test gedaan op wappiemeter.appelent.com (gemaakt door @ericjansen88) en mijn score was ' + totalScore + '%25';
    const getJudgement = () => {
      if(totalScore === 0) return 'Geen wappie / een schaap'
      else if(totalScore < 21) return 'Een beetje wappie'
      else if(totalScore < 61) return 'Ja, wappie'
      else return 'Niet meer te redden'
    }
    return (
      <CustomCard title="Wappiemeter 1.0" buttonText="Start opnieuw" buttonAction={startOver}>

        <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            Einduitslag
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            {totalScore}% ({getJudgement()})
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: 'warning.main',
              height: 56,
              width: 56
            }}
          >
            <InsertChartIcon />
          </Avatar>
        </Grid>
      </Grid>
      <Box sx={{ pt: 3 }}>
        <LinearProgress
          value={totalScore}
          variant="determinate"
        />
      </Box>
      <br />
      <Typography variant="body2">
          <br />
          Over deze uitslag kan niet worden gecorrespondeerd.<br />
          <Button href={"https://twitter.com/intent/tweet?text=" + text} variant="contained" size="small" target="_blank">Tweet de uitslag!</Button>
          <br /><br />
          Legenda:<br />
          0% = Geen wappie / een schaap<br />
          1-20% = Niet echt wappie / een klein beetje wappie<br />
          20-60% = Ja, wappie<br />
          60+% = Niet meer te redden
        </Typography>
        <br /><br />
        <Typography variant="body2">
        Je kunt me een kleine donatie geven via de site BuyMeACoffee.com
        Deze donatie gebruik ik om de hosting van deze site te betalen, of om 'a la Willem Wappie' een stuk grond in Spanje te kopen.
        In ieder geval bedankt!
        </Typography>
        <Button href='https://bunq.me/ericjansen' variant="contained" size="small" target="_blank">Doneer!</Button>
      </CustomCard>)
  }

  return (
    <CustomCard title={"Wappiemeter 1.0 - Vraag " + (currentQuestion + 1)} buttonText={selectedQuestions[currentQuestion + 1] ? "Volgende Vraag" : "Bekijk uitslag"} buttonAction={selectedQuestions[currentQuestion + 1] ? setNextQuestion : finish}>
      {/* <Typography variant="h5" component="div">
      Vraag {currentQuestion + 1}
    </Typography> */}
    {selectedQuestions[currentQuestion].image && <img src={selectedQuestions[currentQuestion].image} alt="Plaatje" width='100%'/>}
    <Typography variant="body2" style={{ fontWeight: 600 }}>
      {selectedQuestions[currentQuestion].question}
    </Typography>
    <FormControl>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={currentAnswer.answer || undefined}
        onChange={handleChange}
      >
        {selectedQuestions[currentQuestion].answers.map((answer) => (
          <FormControlLabel key={answer.answer} value={answer.answer} control={<Radio />} label={answer.answer} />
        ))}
      </RadioGroup>
    </FormControl>
    </CustomCard>);
}

export default App;
