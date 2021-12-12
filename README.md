# mobiiliohjelmointiprojekti5

Vaateinventaarioapp KOMERO

Applikaatiolla on tarkoitus hallinoida perheen lasten vaatteet.
Vaattekappaleita voi tallentaa kuvan ja muiden tietojen, kuten merkin kanssa ja kuka sen käyttäjä on.
Vaatekappaleiden tietoja voi muuttaa
Applikaatiolla voi selailla vaatekappaleita.

Perheen lasten tiedot voi tallentaa. Tietoihin kuuluu pituus, ikä ja nimi.
Lasten tietoja voi muuttaa.
Applikaatio laskee tämänhetkisen pituuden lapselle käyttäen tilastollista dataa lasten kasvuista.

Applikaatiolla on käyttäjiä. Jokainen käyttäjä luo oman tunnuksen ja samalla perhekokoelman.

Applikaatio käyttää seuraavio teknologioita

Firebase - kaikki tiedot käyttäjistä ja lapsista tallennetaa Firebase Firestor tietokantaan (lukuun ottamatta kuvia) (@firebase/firestore)
Formik lomakkeita
Kameraa (expo-camera)
Laitteistossa olevat kuvat (expo-image-picker)
DatePicker jolla valitaan päivämäärä (@react-native-community/picker)
React native elements muun muassa nappeihin ja input kenttiin
Ikoneja (Ant design @expo/vector-icons)
Toasteja joilla näytetään tietoja käyttäjälle (ToastAndroid from reac native)
Async Storage jonka avulla applikaatio muistaa käyttäjän sisäänkirjautuminen (@react-native-async-storage/async-storage)
Environment variables jonka avulla käyttäjä pysyy kirjautuneena ja oikeat tiedot haetaan tietokannasta.