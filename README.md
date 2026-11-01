# FAC Discipleship Bands prototype

A browser-local interactive demo based on the final ministry proposal and FAC design prompt. Uses Noto Sans, FAC green #87D37C, FAC blue #00B2E2, and responsive layouts.

## Run

No installation or build required. Serve `dist` with any static HTTP server, for example `python -m http.server 8000 --directory dist`, then open http://localhost:8000. To deploy to Netlify, use `dist` as the publish directory, with no build command. `npm test` runs the matching tests using Node's built-in runner.

## Try the participant journey

1. Join a Band; enter a made-up email and use the simulated sign-in link.
2. Use Calgary, Men, English, In person, America/Edmonton, Saturday 10:00 and your chosen travel radius (20 km works for central Calgary).
3. Submit. Open Demo controls → Host to accept the pending request.
4. Switch to Participant. Confirm the offered place to unlock the private Band page.
5. Try Staff to approve the sample pending Band; try invitations, waiting lists, help requests, meeting updates, leaving and the six-month review preview.

Demo controls also offer a host selector, simulated email inbox, participant sign-out, and reset. All records are stored on this browser and this origin; they don't sync to other devices or between preview and deployed URLs.

## Rules implemented

- Staff approval before recruitment or invitations; same-gender and language requirements.
- Oldest eligible open Band first, one request at a time; no automatic rematching to a declining or previously left Band.
- User-selected straight-line travel radius from approximate coordinates to the host-set location for in-person Bands. Sample city coordinates are built in; other locations accept manual coordinates or optional approximate GPS. No geocoding provider or driving routes.
- Weekly availability in the participant's IANA time zone; meetings converted from host time zones.
- Host acceptance reserves capacity; participant confirmation creates membership. Maximum five confirmed/reserved places.
- Waiting-list consent and withdrawal; invitations require invited email sign-in and fit/commitment confirmation.
- Private meeting information shown only in the confirmed-member flow. Demo role switching deliberately exposes sample host and staff screens for testing.
- Band stages, meeting guide, draft agreement, reporting preview and six-month next-step requests.

## Demo limitations / pilot work

No real authentication, access control, emails, backend, scheduled reminders, automatic waiting-list processing, geocoding or enforced six-month reminders. The simulated inbox represents email and in-app updates. Host meeting URLs open sample provider homepages. New requests and waiting-list checks are driven through the UI. Availability uses a limited set of sample weekly times. Meeting changes need to be checked against pending offers in the connected pilot. Location changes after creation will need staff review in the pilot; the demo's host editor changes the private venue text but not the matching coordinates.

Do not use real personal data. All sample data and browser-local records can be inspected by someone using the same browser. Real member protection must be enforced on a backend before real-world use. FAC contact details, safeguarding procedure, sender email and final agreement must be supplied before a pilot. A host leaving/transfer workflow and verified invite eligibility also need backend implementation.

## Files

- `dist/index.html`, `style.css`, `app.js`: user interface and demo orchestration
- `dist/model.js`: matching, capacity, membership and time-zone logic
- `tests/model.test.mjs`: tests for matching and membership invariants
- `.openai/hosting.json`: private demo hosting metadata

Bundled Noto Sans is licensed under the SIL Open Font License; see `dist/OFL.txt`. The font is subset to the English interface's characters to reduce download size. Broader scripts should be bundled when translated interface text is introduced.
