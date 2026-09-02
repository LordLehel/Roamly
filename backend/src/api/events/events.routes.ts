import { Router } from 'express';
import eventsController from './events.controller';
import { validateData } from '../../middlewares/validate.middleware';
import * as zodSchemas from './events.validation';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

export default router;

// - event keszitese -> ezt valahogy ugy terveztem, 
// hogy lesznek public es private event-ek, a public-ot mindenki latja,
// a private-et csak a participant-ok es a group-ban levo leader-ek.
// Kesziteskor meg lehet adni, hogy kiket akarunk participant-nak tenni.
// Ha az event publikus lesz es nem adunk meg participant-ot akkor mindenki
// egybol participant, ha privat akkor csak a letrehozo.
// ----> (participants tabla inkabb maradjon a private esemenyekre, 
// ha minden tag benne van a public esemenyben ne vezessuk ujra fel oket a
// participants tablaba is, felesleges)

// - event update -> itt nevet kellene atirni, modositani,
// hogy privat vagy public event, esetleg a datumot amikorra be van tervezve az event.
// Valahogyan azt is el kellene lehessen kovetni, hogy uj participant-okat rendelek hozza,
// az nem tudom az update-be belefer-e, vagy legyen ra uj endpoint
// ----> kulon endpoint alap adatok modositasara (cim, lairas, kezdet, veg, lathatosag, ...)
// ----> kulon endpoint uj participantok hozzaadasara


// - event delete -> ez magaert beszel
// ----> csak leader torolhet


// - event listing -> itt egy query parameterben megadhato a datum opcionalisan,
// ha van megadott datum akkor csak az adott datumon levo eventeket mutatja,
// ha nincs megadva datum, akkor az osszeset mutatja
// ----> lekerdezesben legyen start es end date is, igy tobb mindent le lehet kerni,
// pl teljes hetes progik
// ----> jogosultsagot is keverjuk bele a listazasba, hogy csak azokat 
// az eventeket lassam amikhez kozom va, vagy mindent ha leader vagyok