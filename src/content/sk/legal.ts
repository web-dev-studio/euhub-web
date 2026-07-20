import type { LegalContent } from '../types';

/**
 * Právny obsah — predbežný preklad.
 * Musí byť preverený slovenským právnikom pred launchom.
 * SK právne stránky majú vlastný lastUpdated (nezávislý od EN).
 */

const lastUpdated = '2026-07-06';

const privacyPolicy: LegalContent = {
  title: 'Ochrana osobných údajov',
  lastUpdated,
  body: [
    'Build with EUHub („my", „nás") prevádzkuje build.euhub.co. Tento dokument vysvetľuje, ako zaobchádzame s osobnými údajmi, keď používate tento web alebo odošlete požiadavku cez kontaktný formulár.',
    'Dáta, ktoré zbierame: Keď odošlete formulár „Vyžiadať web audit", zbierame informácie, ktoré poskytnete — meno, email, firma, detaily projektu a voliteľné polia, ktoré vyplníte. Nezbierame viac dát, než je potrebné na odpoveď na vašu požiadavku.',
    'Analytika: Používame Umami Analytics, cookieless analytickú platformu hostovanú v EU (Frankfurt region). Umami nenastavuje cookies a nesleduje jednotlivcov naprieč webmi. Zbierame agregované metriky — page views, referrery a počty eventov — aby sme pochopili, ako sa web používa. Consent banner nie je potrebný, pretože sa nenastavujú non-essential cookies.',
    'Tretie strany (processors): Keď odošlete formulár, vaše dáta sa prenášajú do Google Cloud Platform (náš hosting provider) a do webhook destinácie, ktorá smeruje submission do našich interných systémov. Analytické dáta spracováva Umami Cloud (EU/Frankfurt). Každý processor operuje pod GDPR-compatible podmienkami.',
    'Právný základ: Form submissions spracovávame podľa článku 6(1)(b) GDPR (nevyhnutné na kroky pred zmluvou na vašu žiadosť). Analytické dáta spracovávame podľa článku 6(1)(f) GDPR (oprávnený záujem na pochopení používania webu).',
    'Uchovávanie: Form submissions sa uchovávajú až 12 mesiacov, ak nevznikne projekt, a počas trvania klientskeho vzťahu plus 3 roky, ak projekt vznikne. Analytické dáta sa uchovávajú v agregovanej forme bez individuálnej identifikácie.',
    'Vaše práva: Máte právo na prístup, opravu, vymazanie, obmedzenie alebo namietanie spracovania vašich osobných údajov. Máte tiež právo na prenosnosť dát a právo podať sťažnosť dohliadaciemu orgánu. Na uplatnenie práva nám napíšte na hello@euhub-ai.com.',
    'Kontakt: Pre otázky ohľadom ochrany osobných údajov napíšte na hello@euhub-ai.com. Sídlime na Slovensku, v Európskej únie.',
  ],
};

const cookiePolicy: LegalContent = {
  title: 'Cookie Policy',
  lastUpdated,
  body: [
    'Tento web nenastavuje non-essential cookies. Consent banner sa nezobrazuje, pretože sa nepoužívajú tracking cookies.',
    'Analytika: Používame Umami Analytics, cookieless analytickú platformu. Umami meria agregovaný traffic bez nastavovania cookies a bez identifikácie jednotlivých návštevníkov. Consent nie je potrebný podľa ePrivacy Directive / PECR pre cookieless analytiku.',
    'Essential cookies: Tento web môže nastaviť strictly necessary cookies pre bezpečnosť alebo funkcionalitu, ak sa v budúcnosti pridajú interaktívne funkcie. Každé také cookies budú zdokumentované tu.',
    'Tretie strany: Cloudflare Turnstile sa používa na spam ochranu kontaktného formulára. Turnstile môže nastaviť technické cookie (cf_clearance) ako súčasť bot-detection procesu. Toto je bezpečnostné opatrenie, nie tracking.',
    'Zmeny: Ak sa to zmení — napríklad ak pridáme nástroj, ktorý nastavuje non-essential cookies — updatneme tento dokument a pridáme consent mechanizmus pred deployom toho nástroja.',
  ],
};

const terms: LegalContent = {
  title: 'Podmienky použitia',
  lastUpdated,
  body: [
    'Tieto podmienky upravujú vaše používanie build.euhub.co, ktorý prevádzkuje Build with EUHub („my", „nás").',
    'Právny subjekt: build.euhub.co prevádzkuje Engineers Incubator s. r. o., Horná 67, 974 01 Banská Bystrica, Slovenská republika (IČO: 53741200, DIČ: 2121479470, IČ DPH: SK2121479470), súčasť skupiny EUHUB.',
    'Účel webu: Tento web je marketingová a lead-generation stránka. Odoslanie kontaktného formulára predstavuje požiadavku na informácie o našich službách. Nepredstavuje zmluvu, ponuku ani záväzok dodať službu.',
    'Form submissions: Keď odošlete formulár „Vyžiadať web audit", súhlasíte, že vás môžeme kontaktovať ohľadom vašej požiadavky. Zodpovedáte za presnosť informácií, ktoré poskytnete. Neodosielajte dôverné alebo citlivé informácie cez formulár.',
    'Intelektuálne vlastníctvo: Obsah, dizajn a kód tohto webu sú naším vlastníctvom. Nemôžete kopírovať, reprodukovať alebo redistribuovať web bez povolenia.',
    'Bez záruky: Tento web je poskytovaný „tak ako je" bez akejkoľvek záruky. Negarantujeme, že web bude bez chýb, bez prerušenia alebo vhodný na konkrétny účel.',
    'Zodpovednosť: V rozsahu povolenom zákonom je naša zodpovednosť za akúkoľvek stratu z používania tohto webu obmedzená na sumu, ktorú ste nám zaplatili za používanie, čo je nula.',
    'Príslušný zákon: Tieto podmienky sa riadia zákonmi Slovenskej republiky. Spory budú riešené na slovenských súdoch, ak nie ste spotrebiteľ oprávnený podať konanie v krajine vášho bydliska.',
    'Kontakt: Pre otázky ohľadom týchto podmienok napíšte na hello@euhub-ai.com.',
  ],
};

export const legalBundle = { privacyPolicy, cookiePolicy, terms };
