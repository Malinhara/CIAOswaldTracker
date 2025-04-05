--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: trevorgillan
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO trevorgillan;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: trevorgillan
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO trevorgillan;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: trevorgillan
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE drizzle.__drizzle_migrations_id_seq OWNER TO trevorgillan;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: trevorgillan
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: evidence; Type: TABLE; Schema: public; Owner: trevorgillan
--

CREATE TABLE public.evidence (
    id integer NOT NULL,
    user_id integer NOT NULL,
    market_id integer,
    title text NOT NULL,
    content text NOT NULL,
    text text,
    evidence_type text DEFAULT 'yes'::text NOT NULL,
    url text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.evidence OWNER TO trevorgillan;

--
-- Name: evidence_id_seq; Type: SEQUENCE; Schema: public; Owner: trevorgillan
--

CREATE SEQUENCE public.evidence_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.evidence_id_seq OWNER TO trevorgillan;

--
-- Name: evidence_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trevorgillan
--

ALTER SEQUENCE public.evidence_id_seq OWNED BY public.evidence.id;


--
-- Name: market_odds_history; Type: TABLE; Schema: public; Owner: trevorgillan
--

CREATE TABLE public.market_odds_history (
    id integer NOT NULL,
    market_id integer NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL,
    yes_odds numeric NOT NULL,
    no_odds numeric NOT NULL,
    yes_amount numeric NOT NULL,
    no_amount numeric NOT NULL,
    total_liquidity numeric NOT NULL
);


ALTER TABLE public.market_odds_history OWNER TO trevorgillan;

--
-- Name: market_odds_history_id_seq; Type: SEQUENCE; Schema: public; Owner: trevorgillan
--

CREATE SEQUENCE public.market_odds_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.market_odds_history_id_seq OWNER TO trevorgillan;

--
-- Name: market_odds_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trevorgillan
--

ALTER SEQUENCE public.market_odds_history_id_seq OWNED BY public.market_odds_history.id;


--
-- Name: markets; Type: TABLE; Schema: public; Owner: trevorgillan
--

CREATE TABLE public.markets (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    initial_evidence text,
    creator_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    participants integer DEFAULT 0 NOT NULL,
    total_liquidity numeric DEFAULT '0'::numeric NOT NULL,
    yes_resolution text,
    no_resolution text,
    yes_odds numeric DEFAULT 0.5 NOT NULL,
    no_odds numeric DEFAULT 0.5 NOT NULL,
    current_odds numeric DEFAULT 0.5 NOT NULL,
    yes_amount numeric DEFAULT 0 NOT NULL,
    no_amount numeric DEFAULT 0 NOT NULL
);


ALTER TABLE public.markets OWNER TO trevorgillan;

--
-- Name: markets_id_seq; Type: SEQUENCE; Schema: public; Owner: trevorgillan
--

CREATE SEQUENCE public.markets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.markets_id_seq OWNER TO trevorgillan;

--
-- Name: markets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trevorgillan
--

ALTER SEQUENCE public.markets_id_seq OWNED BY public.markets.id;


--
-- Name: predictions; Type: TABLE; Schema: public; Owner: trevorgillan
--

CREATE TABLE public.predictions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    market_id integer NOT NULL,
    probability numeric DEFAULT 0.5 NOT NULL,
    amount numeric NOT NULL,
    "position" text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.predictions OWNER TO trevorgillan;

--
-- Name: predictions_id_seq; Type: SEQUENCE; Schema: public; Owner: trevorgillan
--

CREATE SEQUENCE public.predictions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.predictions_id_seq OWNER TO trevorgillan;

--
-- Name: predictions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trevorgillan
--

ALTER SEQUENCE public.predictions_id_seq OWNED BY public.predictions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: trevorgillan
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    reputation integer DEFAULT 0 NOT NULL,
    upvotes_received integer DEFAULT 0 NOT NULL,
    downvotes_received integer DEFAULT 0 NOT NULL,
    balance numeric DEFAULT '1000'::numeric NOT NULL
);


ALTER TABLE public.users OWNER TO trevorgillan;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: trevorgillan
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO trevorgillan;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trevorgillan
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: votes; Type: TABLE; Schema: public; Owner: trevorgillan
--

CREATE TABLE public.votes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    evidence_id integer NOT NULL,
    value integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.votes OWNER TO trevorgillan;

--
-- Name: votes_id_seq; Type: SEQUENCE; Schema: public; Owner: trevorgillan
--

CREATE SEQUENCE public.votes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.votes_id_seq OWNER TO trevorgillan;

--
-- Name: votes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trevorgillan
--

ALTER SEQUENCE public.votes_id_seq OWNED BY public.votes.id;


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: trevorgillan
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: evidence id; Type: DEFAULT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.evidence ALTER COLUMN id SET DEFAULT nextval('public.evidence_id_seq'::regclass);


--
-- Name: market_odds_history id; Type: DEFAULT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.market_odds_history ALTER COLUMN id SET DEFAULT nextval('public.market_odds_history_id_seq'::regclass);


--
-- Name: markets id; Type: DEFAULT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.markets ALTER COLUMN id SET DEFAULT nextval('public.markets_id_seq'::regclass);


--
-- Name: predictions id; Type: DEFAULT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.predictions ALTER COLUMN id SET DEFAULT nextval('public.predictions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: votes id; Type: DEFAULT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.votes ALTER COLUMN id SET DEFAULT nextval('public.votes_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: trevorgillan
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	c68ebbf65da896d87e5ec63dc5a5f4facb2cbe00cf09ab4375d6f01147fc0bcb	1740491880069
\.


--
-- Data for Name: evidence; Type: TABLE DATA; Schema: public; Owner: trevorgillan
--

COPY public.evidence (id, user_id, market_id, title, content, text, evidence_type, url, created_at) FROM stdin;
24	1	23	CIA financially supported Oswald from 1959-1961	https://orbisbooks.com/products/jfk-and-the-unspeakable	Author James Douglas meticulously documents how the CIA through the USAID cut-out named "Public Works Inc" provided Lee Harvey Oswald a stipend of $6,000 yearly while he lived in New Orleans two years prior to the assassination. 	yes	\N	2025-03-31 19:57:28.482384
25	1	23	Warren Commission Claims That Lee Harvey Oswald Acted Alone	https://www.govinfo.gov/content/pkg/GPO-WARRENCOMMISSIONHEARINGS-25/pdf/GPO-WARRENCOMMISSIONHEARINGS-25.pdf	Committee chaired by CIA Director, Allen Dulles, concludes that Lee Harvey Oswald acted alone during the planning and execution of the assassination. 	no	\N	2025-03-31 19:59:21.287034
26	1	23	Statistician finds 99% chance that there were multiple shooters	https://stories.tamu.edu/news/2017/12/07/two-shooters-texas-am-statistician-says-better-forensic-science-can-reveal-more-about-the-jfk-assassination/	Spiegelman, a Texas A&M Professor of Statistics, concludes using audio analysis that there was another shooter besides Oswald. This shooter was extremely likely to be tied to an organization due to them receiving media protection preventing the revealing of their identity. 	yes	\N	2025-04-02 11:53:45.999514
27	1	23	Definitive Account of Lee Harvey Oswald 	https://www.amazon.com/Case-Closed-Harvey-Oswald-Assassination/dp/0679418253	Posner, a lay historian, debunks the multiple shooter hypothesis by citing the findings of the official autopsy and addressing the "grassy knoll" theory of assassination. 	no	\N	2025-04-02 12:00:02.8171
28	1	26	Voter Watchdog uncovers 30,000+ fraudulent votes 	https://www.nationalreview.com/news/the-data-analysts-who-believe-theyve-uncovered-widespread-illegal-voting-in-georgia/	Vote Watchdog, Georgia Nerds, finds 30,000 dead persons that voted in the 2020 election in favor of Joe Biden	yes	\N	2025-04-02 15:24:44.649035
29	1	26	PNAS Reports no evidence for systematic voter fraud in 2020	https://www.pnas.org/doi/10.1073/pnas.2103619118	Stanford researchers find no evidence of voter fraud in 2020 election using basic number theory checks	no	\N	2025-04-02 15:28:17.996249
30	1	26	Twitter - Georgia Nerds Announcing Evidence of Fraud	https://x.com/Pacolypto/status/1821924395272560736	Georgia Nerds issue public statement laying out how local Dems stole the state, handing the election unfairly to Joe Biden	yes	\N	2025-04-02 15:32:15.281655
31	1	26	Brennan Center for Justice Dismisses any claims that the 2020 election was stolen	https://www.brennancenter.org/sites/default/files/analysis/Briefing_Memo_Debunking_Voter_Fraud_Myth.pdf	The report reviewed elections that had been meticulously studied for\nvoter fraud, and found incident rates between 0.0003 percent and 0.0025 percent.	no	\N	2025-04-02 15:34:07.311619
32	1	25	Robert Maxwell, an Israeli Spy, is Ghislane Maxwell's Father and Jeffrey Epstein's Father in-law	https://unlimitedhangout.com/2019/08/investigative-series/mega-group-maxwells-and-mossad-the-spy-story-at-the-heart-of-the-jeffrey-epstein-scandal/	Journalist, Whitney Webb, details the extensive connections that Jeffrey Epstein maintained with Robert Maxwell, a Israeli confirmed by the embassy in Jerusalem in 1966	yes	\N	2025-04-02 15:39:52.028236
33	1	25	Israeli PM, Ehud Barak, met with Jeffrey Epstein 30 Times	https://www.timesofisrael.com/ehud-barak-met-with-jeffrey-epstein-dozens-of-times-flew-on-private-plane-report/	Ehud Barak, Prime Minister of Israel from 1999-2001, met with Jeffrey Epstein 30 times from 2013-2017. This is after his initial pedophile charges were made public in 2011 in NY. 	yes	\N	2025-04-02 15:44:34.417132
34	1	25	Nobody Denies Jeffrey Epstein was an Israeli Spy 	https://www.rollingstone.com/culture/culture-features/jeffrey-epstein-steven-hoffenberg-intelligence-agencies-spy-1197708/	Even Rolling Stone admits, Jeffrey Epstein was an Israeli Spy	no	\N	2025-04-02 15:45:50.351959
35	1	27	Candace Owens Lays out the Case Brigitte Macron was born a man	https://www.youtube.com/playlist?list=PLPW2eH9z9CUvJ0Iiv9AQqq2RVAWFFfNZR	Journalist and internet personality Candace Owens creates an eight-piece documentary detailing how Brigitte Macron was born a man named Jean-Michel Trogneux before transitioning to a female in her late early 30s prior to meeting Emmanuel Macron. 	yes	\N	2025-04-02 15:50:59.324048
36	1	27	Brigitte Macron sues over false claims that she is a man	https://www.bbc.com/news/world-europe-59753535	Brigitte Macron pursues legal action against journalist Natacha Rey who claimed that Brigitte Macron was born a man	no	\N	2025-04-02 15:53:46.200639
37	1	27	Macron family threatens Candace Owens with Legal Pressure	https://www.youtube.com/watch?v=tJtAUKgkqc0	Macron family pursues legal action against Candace Owens on charges unrelated to the central claim that Brigitte Macron was born a man. This obviously reads as a pressure campaign because they cannot dispute the claims on fact. 	yes	\N	2025-04-02 16:01:14.738908
\.


--
-- Data for Name: market_odds_history; Type: TABLE DATA; Schema: public; Owner: trevorgillan
--

COPY public.market_odds_history (id, market_id, "timestamp", yes_odds, no_odds, yes_amount, no_amount, total_liquidity) FROM stdin;
1	27	2025-04-02 17:18:54.924654	0.9272918861959958	0.07270811380400422	44000	3450	47450
2	27	2025-04-02 17:20:04.538168	0.9278996865203761	0.07210031347962387	44400	3450	47850
3	26	2025-04-02 17:26:58.758901	0.3576388888888889	0.6423611111111112	10300	18500	28800
4	26	2025-04-02 17:30:20.797112	0.3539518900343643	0.6460481099656357	10300	18800	29100
5	27	2025-04-02 17:30:30.491874	0.9280500521376434	0.07194994786235664	44500	3450	47950
6	26	2025-04-02 17:30:37.95394	0.3561643835616438	0.6438356164383562	10400	18800	29200
7	23	2025-04-02 17:30:43.939396	0.46848899012908124	0.5315110098709188	6170	7000	13170
8	24	2025-04-02 17:30:49.162353	0.48484848484848486	0.5151515151515151	1600	1700	3300
9	25	2025-04-02 17:30:54.22899	0.5995995995995996	0.40040040040040037	599	400	999
10	29	2025-04-02 17:31:00.517619	1	0	150	0	150
11	25	2025-04-02 17:31:07.171302	0.6360327570518653	0.36396724294813465	699	400	1099
12	29	2025-04-02 17:31:13.41664	1	0	250	0	250
13	28	2025-04-02 17:31:19.08882	0.6666666666666666	0.33333333333333337	100	50	150
14	27	2025-04-02 17:31:24.443014	0.9261186264308012	0.07388137356919877	44500	3550	48050
15	26	2025-04-02 17:31:29.861021	0.35494880546075086	0.6450511945392492	10400	18900	29300
16	23	2025-04-02 17:31:34.675009	0.46495855312735496	0.535041446872645	6170	7100	13270
17	24	2025-04-02 17:31:40.17004	0.47058823529411764	0.5294117647058824	1600	1800	3400
18	25	2025-04-02 17:31:45.353218	0.5829858215179317	0.41701417848206834	699	500	1199
19	25	2025-04-02 17:31:51.162498	0.5381062355658198	0.4618937644341802	699	600	1299
20	25	2025-04-02 17:31:56.288624	0.4996426018584703	0.5003573981415297	699	700	1399
21	29	2025-04-02 17:32:01.960466	0.7142857142857143	0.2857142857142857	250	100	350
22	28	2025-04-02 17:32:07.943628	0.4	0.6	100	150	250
23	29	2025-04-02 17:32:13.052817	0.5555555555555556	0.4444444444444444	250	200	450
24	27	2025-04-02 17:37:56.678914	0.9072375127420998	0.09276248725790015	44500	4550	49050
25	27	2025-04-02 17:40:23.562889	0.49971925884334645	0.5002807411566536	44500	44550	89050
26	26	2025-04-02 18:32:55.611264	0.37623762376237624	0.6237623762376238	11400	18900	30300
27	26	2025-04-02 18:33:00.209008	0.5310173697270472	0.46898263027295284	21400	18900	40300
28	26	2025-04-02 18:34:22.392387	0.6242544731610338	0.3757455268389662	31400	18900	50300
29	26	2025-04-02 18:36:21.400346	0.578268876611418	0.421731123388582	31400	22900	54300
30	26	2025-04-02 18:36:31.617245	0.3329798515376458	0.6670201484623541	31400	62900	94300
31	26	2025-04-02 19:34:01.805765	0.3969319271332694	0.6030680728667306	41400	62900	104300
32	26	2025-04-02 19:34:15.616349	0.36220472440944884	0.6377952755905512	41400	72900	114300
33	26	2025-04-02 19:35:58.444103	0.3677363399826539	0.6322636600173461	42400	72900	115300
34	26	2025-04-02 19:36:04.489369	0.19693450998606596	0.803065490013934	42400	172900	215300
35	26	2025-04-02 19:37:06.252986	0.4516333650491595	0.5483666349508405	142400	172900	315300
36	26	2025-04-02 19:37:12.189177	0.5836744522032266	0.41632554779677344	242400	172900	415300
37	24	2025-04-03 08:48:58.567287	0.5909090909090909	0.40909090909090906	2600	1800	4400
38	24	2025-04-03 08:49:06.489916	0.875	0.125	12600	1800	14400
39	24	2025-04-03 09:00:47.191358	0.9262295081967213	0.07377049180327866	22600	1800	24400
40	24	2025-04-03 09:01:02.485931	0.509009009009009	0.49099099099099097	22600	21800	44400
41	24	2025-04-03 09:02:27.726555	0.5301724137931034	0.4698275862068966	24600	21800	46400
42	25	2025-04-03 09:08:40.646967	0.9385911044828493	0.061408895517150675	10699	700	11399
43	26	2025-04-03 09:15:10.86894	0.5699506230895838	0.4300493769104162	242400	182900	425300
44	26	2025-04-03 09:20:29.857021	0.6518180087569008	0.34818199124309923	342400	182900	525300
45	26	2025-04-03 09:21:56.983711	0.5951677385711802	0.4048322614288198	342400	232900	575300
46	26	2025-04-03 09:37:07.749356	0.507033910854435	0.49296608914556495	342400	332900	675300
47	26	2025-04-03 09:37:18.422465	0.5966315279292379	0.4033684720707621	492400	332900	825300
48	26	2025-04-03 09:39:04.124283	0.6402247919593645	0.35977520804063545	592400	332900	925300
49	24	2025-04-03 09:39:32.933408	0.6134751773049646	0.3865248226950354	34600	21800	56400
50	24	2025-04-03 09:49:14.2195	0.860613810741688	0.13938618925831203	134600	21800	156400
51	24	2025-04-03 09:50:19.739257	0.8614993646759848	0.13850063532401524	135600	21800	157400
52	26	2025-04-03 10:19:04.013124	0.6406131922703228	0.35938680772967724	593400	332900	926300
53	26	2025-04-03 10:19:49.845594	0.6444515646694435	0.35554843533055647	603400	332900	936300
54	23	2025-04-03 10:21:22.605307	0.5024526979677646	0.4975473020322354	7170	7100	14270
55	23	2025-04-03 10:21:28.632911	0.06274612759254397	0.9372538724074561	7170	107100	114270
56	23	2025-04-03 10:21:38.877106	0.7414729524223332	0.25852704757766676	307170	107100	414270
\.


--
-- Data for Name: markets; Type: TABLE DATA; Schema: public; Owner: trevorgillan
--

COPY public.markets (id, title, description, initial_evidence, creator_id, created_at, participants, total_liquidity, yes_resolution, no_resolution, yes_odds, no_odds, current_odds, yes_amount, no_amount) FROM stdin;
24	Was the Moon Landing Faked?		\N	1	2025-04-02 17:49:25.741	0	157400	The market will resolve "Yes" if the Apollo 11 crew (Neil Armstrong, Buzz Aldrin, etc) did not land on the moon during the original space mission in 1969. 	The market will resolve "No" if the Apollo 11 crew (Neil Armstrong, Buzz Aldrin, etc) did indeed land on the moon during the original space mission in 1969. 	0.5	0.5	0.8614993646759848	135600	21800
26	Was the 2020 Presidential Election "Stolen" in favor of Joe Biden?		\N	1	2025-04-02 18:18:37.753	0	936300	The market will resolve "Yes" if there was enough intentional voter fraud to steal the election in favor of Joe Biden. This means without intentional voter fraud, Donald Trump would have won the the 2020 Presidential Election. 	Otherwise, the market will resolve "No." Meaning that there was not enough voter fraud to artificially swing the election results in favor of Joe Biden. 	0.5	0.5	0.6444515646694435	603400	332900
28	Is Justin Trudeau the biological son of Fidel Castro? 		\N	1	2025-04-02 18:46:29.226	0	250	The market will resolve as 'Yes' if Justin Trudeau's biological father is Fidel Castro, the former Prime Minister of Cuba	Otherwise, the market will resolve 'No'	0.5	0.5	0.4	100	150
29	Does the US Government have definite proof that intelligent Aliens Exist? 		\N	1	2025-04-02 20:04:55.767	0	450	The market will resolve 'Yes' if the US government currently holds proof that certifies that there is intelligent life outside of earth that has either visited or interacted with humans. 	Otherwise, the market will resolve 'No'	0.5	0.5	0.5555555555555556	250	200
27	Was Brigitte Macron, Emmanuel Macron's wife, born a man?		\N	1	2025-04-02 18:44:27.459	0	89050	The market will resolve 'Yes' if Brigitte Macron was born a man. This mean that Brigitte Macron started life as a man and later transitioned into becoming a woman. 	Otherwise, the market will resolve 'No'	0.5	0.5	0.49971925884334645	44500	44550
23	Did Lee Harvey Oswald act alone in the planning or execution of JFKs Assassination?		\N	1	2025-03-31 23:14:03.235	0	414270	The market will resolve "yes" if Lee Harvey Oswald acted alone and no other organizations aided in the planning or the execution of the assassination. 	The market will resolve "no" if Lee Harvey Oswald was aided by any organization in the planning or execution of the assassination. A few possible organizations that could have participated in the crime are the mob, the CIA, Mossad, etc. 	0.5	0.5	0.7414729524223332	307170	107100
25	Was Jeffrey Epstein a Mossad or CIA Agent?		\N	1	2025-04-02 18:04:13.453	0	11399	The market will resolve 'Yes' if Jeffrey Epstein was working for either the CIA or Mossad to gather intelligence or blackmail on influential 	The market will resolve 'No' if Jeffrey Epstein had no connection to the espionage activities directed by the CIA or Mossad	0.5	0.5	0.9385911044828493	10699	700
\.


--
-- Data for Name: predictions; Type: TABLE DATA; Schema: public; Owner: trevorgillan
--

COPY public.predictions (id, user_id, market_id, probability, amount, "position", created_at) FROM stdin;
123	1	24	0.5	1500	yes	2025-04-02 17:49:32.684
124	1	24	0.5	700	no	2025-04-02 17:49:37.841
125	1	25	0.5	499	yes	2025-04-02 18:04:23.802
126	1	25	0.5	400	no	2025-04-02 18:04:28.129
127	1	26	0.5	10000	yes	2025-04-02 18:18:56.172
128	1	26	0.5	8000	no	2025-04-02 18:19:02.108
129	1	27	0.5	44000	yes	2025-04-02 19:34:24.723
130	1	27	0.5	3300	no	2025-04-02 19:34:33.75
131	1	26	0.5	500	no	2025-04-02 20:35:54.919
132	1	26	0.5	10000	no	2025-04-02 20:36:07.414
133	1	24	0.5	1000	no	2025-04-02 20:36:32.086
134	1	29	0.5	50	yes	2025-04-02 20:36:55.712
135	1	28	0.5	50	no	2025-04-02 20:37:09.189
136	1	27	0.5	150	no	2025-04-02 21:18:54.925
137	1	27	0.5	400	yes	2025-04-02 21:20:04.539
138	1	26	0.5	300	yes	2025-04-02 21:26:58.759
139	1	26	0.5	300	no	2025-04-02 21:30:20.797
140	1	27	0.5	100	yes	2025-04-02 21:30:30.492
141	1	26	0.5	100	yes	2025-04-02 21:30:37.954
142	1	23	0.5	100	yes	2025-04-02 21:30:43.939
143	1	24	0.5	100	yes	2025-04-02 21:30:49.162
144	1	25	0.5	100	yes	2025-04-02 21:30:54.229
145	1	29	0.5	100	yes	2025-04-02 21:31:00.517
146	1	25	0.5	100	yes	2025-04-02 21:31:07.171
147	1	29	0.5	100	yes	2025-04-02 21:31:13.416
148	1	28	0.5	100	yes	2025-04-02 21:31:19.089
149	1	27	0.5	100	no	2025-04-02 21:31:24.443
150	1	26	0.5	100	no	2025-04-02 21:31:29.861
151	1	23	0.5	100	no	2025-04-02 21:31:34.675
152	1	24	0.5	100	no	2025-04-02 21:31:40.17
153	1	25	0.5	100	no	2025-04-02 21:31:45.353
154	1	25	0.5	100	no	2025-04-02 21:31:51.162
155	1	25	0.5	100	no	2025-04-02 21:31:56.288
156	1	29	0.5	100	no	2025-04-02 21:32:01.96
157	1	28	0.5	100	no	2025-04-02 21:32:07.943
158	1	29	0.5	100	no	2025-04-02 21:32:13.052
159	1	27	0.5	1000	no	2025-04-02 21:37:56.679
160	1	27	0.5	40000	no	2025-04-02 21:40:23.563
161	1	26	0.5	1000	yes	2025-04-02 22:32:55.611
162	1	26	0.5	10000	yes	2025-04-02 22:33:00.209
163	1	26	0.5	10000	yes	2025-04-02 22:34:22.392
164	1	26	0.5	4000	no	2025-04-02 22:36:21.4
165	1	26	0.5	40000	no	2025-04-02 22:36:31.617
166	1	26	0.5	10000	yes	2025-04-02 23:34:01.806
167	1	26	0.5	10000	no	2025-04-02 23:34:15.616
168	1	26	0.5	1000	yes	2025-04-02 23:35:58.444
169	1	26	0.5	100000	no	2025-04-02 23:36:04.489
170	1	26	0.5	100000	yes	2025-04-02 23:37:06.253
171	1	26	0.5	100000	yes	2025-04-02 23:37:12.189
172	1	24	0.5	1000	yes	2025-04-03 12:48:58.568
173	1	24	0.5	10000	yes	2025-04-03 12:49:06.49
174	1	24	0.5	10000	yes	2025-04-03 13:00:47.191
53	1	23	0.5	100	yes	2025-04-01 18:35:53.675
54	1	23	0.5	50	no	2025-04-01 18:36:00.129
55	1	23	0.5	100	yes	2025-04-01 18:40:11.226
175	1	24	0.5	20000	no	2025-04-03 13:01:02.486
57	1	23	0.5	100	yes	2025-04-01 19:12:04.074
58	1	23	0.5	10	yes	2025-04-01 19:14:11.865
59	1	23	0.5	100	yes	2025-04-01 19:14:21.703
60	1	23	0.5	100	no	2025-04-01 19:14:26.94
176	1	24	0.5	2000	yes	2025-04-03 13:02:27.726
62	1	23	0.5	100	yes	2025-04-01 19:29:26.461
63	1	23	0.5	100	no	2025-04-01 19:29:29.896
177	1	25	0.5	10000	yes	2025-04-03 13:08:40.647
65	1	23	0.5	50	no	2025-04-01 19:55:38.466
178	1	26	0.5	10000	no	2025-04-03 13:15:10.869
67	1	23	0.5	100	yes	2025-04-01 20:05:49.496
68	1	23	0.5	111	yes	2025-04-01 20:11:21.147
179	1	26	0.5	100000	yes	2025-04-03 13:20:29.857
70	1	23	0.5	100	yes	2025-04-01 20:11:58.761
71	1	23	0.5	100	no	2025-04-01 20:12:02.214
72	1	23	0.5	100	yes	2025-04-01 20:12:04.362
180	1	26	0.5	50000	no	2025-04-03 13:21:56.984
74	1	23	0.5	10	yes	2025-04-01 20:40:58.192
75	1	23	0.5	1000	yes	2025-04-01 20:44:16.936
76	1	23	0.5	100	yes	2025-04-01 20:53:43.718
77	1	23	0.5	100	yes	2025-04-01 22:24:12.11
78	1	23	0.5	1000	yes	2025-04-01 22:24:17.744
181	1	26	0.5	100000	no	2025-04-03 13:37:07.749
80	1	23	0.5	10	yes	2025-04-01 22:31:32.866
182	1	26	0.5	150000	yes	2025-04-03 13:37:18.422
183	1	26	0.5	100000	yes	2025-04-03 13:39:04.125
184	1	24	0.5	10000	yes	2025-04-03 13:39:32.934
185	1	24	0.5	100000	yes	2025-04-03 13:49:14.219
186	1	24	0.5	1000	yes	2025-04-03 13:50:19.739
86	1	23	0.5	10	yes	2025-04-01 23:20:33.388
87	1	23	0.5	1000	yes	2025-04-01 23:20:41.042
187	1	26	0.5	1000	yes	2025-04-03 14:19:04.013
89	1	23	0.5	10	yes	2025-04-01 23:23:51.514
188	1	26	0.5	10000	yes	2025-04-03 14:19:49.846
189	1	23	0.5	1000	yes	2025-04-03 14:21:22.605
190	1	23	0.5	100000	no	2025-04-03 14:21:28.633
191	1	23	0.5	300000	yes	2025-04-03 14:21:38.878
100	1	23	0.5	1000	no	2025-04-02 00:05:07.197
101	1	23	0.5	100	yes	2025-04-02 00:09:02.982
103	1	23	0.5	1000	no	2025-04-02 13:21:13.336
104	1	23	0.5	100	yes	2025-04-02 13:50:07.942
105	1	23	0.5	1000	no	2025-04-02 13:50:15.619
106	1	23	0.5	1000	no	2025-04-02 13:50:26.187
107	1	23	0.5	100	yes	2025-04-02 13:58:58.048
108	1	23	0.5	1000	no	2025-04-02 13:59:04.207
111	1	23	0.5	500	no	2025-04-02 14:11:11.731
112	1	23	0.5	1000	yes	2025-04-02 14:12:13.946
113	1	23	0.5	1000	no	2025-04-02 14:20:39.435
114	1	23	0.5	100	no	2025-04-02 14:20:51.159
120	1	23	0.5	9	yes	2025-04-02 15:36:52.483
121	1	23	0.5	500	yes	2025-04-02 16:00:21.516
122	1	23	0.5	100	yes	2025-04-02 16:46:32.812
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: trevorgillan
--

COPY public.users (id, username, password, reputation, upvotes_received, downvotes_received, balance) FROM stdin;
1	default_user	default_pass	33	118	85	850
\.


--
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: trevorgillan
--

COPY public.votes (id, user_id, evidence_id, value, created_at) FROM stdin;
8	1	24	1	2025-04-02 15:41:58.847
9	1	24	-1	2025-04-02 15:42:00.685
10	1	24	-1	2025-04-02 15:42:01.442
11	1	24	-1	2025-04-02 15:42:01.64
12	1	24	-1	2025-04-02 15:42:01.877
13	1	24	1	2025-04-02 15:42:02.51
14	1	24	1	2025-04-02 15:42:02.697
15	1	24	1	2025-04-02 15:42:02.868
16	1	24	1	2025-04-02 15:42:03.034
17	1	24	1	2025-04-02 15:42:03.203
18	1	24	1	2025-04-02 15:42:03.382
19	1	24	1	2025-04-02 15:42:03.524
20	1	24	1	2025-04-02 15:45:16.974
21	1	24	-1	2025-04-02 15:50:17.787
22	1	24	-1	2025-04-02 15:50:18.854
23	1	24	1	2025-04-02 15:50:19.842
24	1	24	1	2025-04-02 15:50:20.461
25	1	24	-1	2025-04-02 15:50:21.345
26	1	24	-1	2025-04-02 15:50:21.56
27	1	24	1	2025-04-02 15:50:22.247
28	1	26	1	2025-04-02 15:53:50.707
29	1	26	1	2025-04-02 15:53:52.924
30	1	26	1	2025-04-02 15:53:53.114
31	1	26	1	2025-04-02 15:53:53.297
32	1	26	1	2025-04-02 15:53:53.462
33	1	26	1	2025-04-02 15:53:53.621
34	1	26	1	2025-04-02 15:53:54.581
35	1	25	1	2025-04-02 15:55:56.386
36	1	25	1	2025-04-02 15:55:57.188
37	1	25	-1	2025-04-02 15:55:57.891
38	1	25	-1	2025-04-02 15:55:58.41
39	1	26	-1	2025-04-02 15:56:42.961
40	1	26	-1	2025-04-02 15:56:43.463
41	1	26	-1	2025-04-02 15:56:43.867
42	1	26	-1	2025-04-02 15:56:44.35
43	1	26	-1	2025-04-02 15:56:47.49
44	1	26	1	2025-04-02 15:56:48.474
45	1	26	1	2025-04-02 15:56:48.657
46	1	24	1	2025-04-02 15:56:48.857
47	1	26	1	2025-04-02 15:56:49.032
48	1	26	1	2025-04-02 15:56:51.708
49	1	26	1	2025-04-02 15:56:52.574
50	1	26	1	2025-04-02 15:56:53.285
51	1	25	-1	2025-04-02 15:56:57.977
52	1	25	-1	2025-04-02 15:56:58.176
53	1	25	-1	2025-04-02 15:56:58.343
54	1	27	-1	2025-04-02 16:00:05.97
55	1	27	-1	2025-04-02 16:00:07.081
56	1	27	1	2025-04-02 16:00:07.806
57	1	27	1	2025-04-02 16:00:07.984
58	1	27	1	2025-04-02 16:00:08.141
59	1	27	1	2025-04-02 16:00:08.307
60	1	27	-1	2025-04-02 16:00:09.164
61	1	25	1	2025-04-02 16:00:10.734
62	1	26	1	2025-04-02 17:02:19.776
63	1	26	-1	2025-04-02 17:02:20.612
64	1	26	-1	2025-04-02 17:02:20.759
65	1	28	1	2025-04-02 19:32:17.937
66	1	30	1	2025-04-02 19:32:18.116
67	1	28	-1	2025-04-02 19:32:19.564
68	1	28	-1	2025-04-02 19:32:20.032
69	1	30	1	2025-04-02 19:32:20.769
70	1	30	1	2025-04-02 19:32:21.304
71	1	30	-1	2025-04-02 19:32:23.366
72	1	30	-1	2025-04-02 19:32:23.6
73	1	30	-1	2025-04-02 19:32:23.753
74	1	30	-1	2025-04-02 19:32:24.117
75	1	28	1	2025-04-02 19:32:24.983
76	1	37	1	2025-04-02 20:01:19.549
77	1	37	1	2025-04-02 20:01:19.972
78	1	35	-1	2025-04-02 20:01:21.116
79	1	35	-1	2025-04-02 20:01:21.617
80	1	35	-1	2025-04-02 20:01:21.792
81	1	36	1	2025-04-02 20:01:24.15
82	1	36	-1	2025-04-02 20:01:24.957
83	1	36	-1	2025-04-02 20:01:25.138
84	1	35	1	2025-04-02 23:45:20.653
85	1	35	1	2025-04-02 23:45:20.911
86	1	35	1	2025-04-02 23:45:22.22
87	1	35	1	2025-04-02 23:45:22.733
88	1	35	1	2025-04-02 23:45:22.944
89	1	35	1	2025-04-02 23:45:23.298
90	1	37	-1	2025-04-02 23:45:25.857
91	1	37	-1	2025-04-02 23:45:26.017
92	1	37	-1	2025-04-02 23:45:26.189
93	1	37	-1	2025-04-02 23:45:26.317
94	1	28	1	2025-04-03 13:39:18.692
95	1	31	1	2025-04-03 13:39:22.285
96	1	31	1	2025-04-03 13:39:22.484
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: trevorgillan
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 1, true);


--
-- Name: evidence_id_seq; Type: SEQUENCE SET; Schema: public; Owner: trevorgillan
--

SELECT pg_catalog.setval('public.evidence_id_seq', 37, true);


--
-- Name: market_odds_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: trevorgillan
--

SELECT pg_catalog.setval('public.market_odds_history_id_seq', 56, true);


--
-- Name: markets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: trevorgillan
--

SELECT pg_catalog.setval('public.markets_id_seq', 29, true);


--
-- Name: predictions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: trevorgillan
--

SELECT pg_catalog.setval('public.predictions_id_seq', 191, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: trevorgillan
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: votes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: trevorgillan
--

SELECT pg_catalog.setval('public.votes_id_seq', 96, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: trevorgillan
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: evidence evidence_pkey; Type: CONSTRAINT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.evidence
    ADD CONSTRAINT evidence_pkey PRIMARY KEY (id);


--
-- Name: market_odds_history market_odds_history_pkey; Type: CONSTRAINT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.market_odds_history
    ADD CONSTRAINT market_odds_history_pkey PRIMARY KEY (id);


--
-- Name: markets markets_pkey; Type: CONSTRAINT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.markets
    ADD CONSTRAINT markets_pkey PRIMARY KEY (id);


--
-- Name: predictions predictions_pkey; Type: CONSTRAINT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.predictions
    ADD CONSTRAINT predictions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: votes votes_pkey; Type: CONSTRAINT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_pkey PRIMARY KEY (id);


--
-- Name: evidence evidence_market_id_markets_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.evidence
    ADD CONSTRAINT evidence_market_id_markets_id_fk FOREIGN KEY (market_id) REFERENCES public.markets(id);


--
-- Name: evidence evidence_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.evidence
    ADD CONSTRAINT evidence_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: market_odds_history market_odds_history_market_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.market_odds_history
    ADD CONSTRAINT market_odds_history_market_id_fkey FOREIGN KEY (market_id) REFERENCES public.markets(id);


--
-- Name: markets markets_creator_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.markets
    ADD CONSTRAINT markets_creator_id_users_id_fk FOREIGN KEY (creator_id) REFERENCES public.users(id);


--
-- Name: predictions predictions_market_id_markets_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.predictions
    ADD CONSTRAINT predictions_market_id_markets_id_fk FOREIGN KEY (market_id) REFERENCES public.markets(id);


--
-- Name: predictions predictions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.predictions
    ADD CONSTRAINT predictions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: votes votes_evidence_id_evidence_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_evidence_id_evidence_id_fk FOREIGN KEY (evidence_id) REFERENCES public.evidence(id);


--
-- Name: votes votes_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: trevorgillan
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

