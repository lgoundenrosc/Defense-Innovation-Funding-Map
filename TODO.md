# TODO — research and build backlog

Working backlog for the next revision of the National Security Government
Capital map. Not part of the published document. Three sections: resolve
what section 8 (Constraints and gaps) already flags, map-quality fixes
found on a fresh read-through, and capital sources the map hasn't explored
yet, weighted toward pre-seed/seed since that's Rosc's stage.

## A. Resolve the existing Constraints and gaps list

Each line below is a section-8 item with a concrete next step.

1. **OSC covered-category count (31 vs. 34).** Pull the actual list of
   covered technology categories from the OSC FY2025 Investment Strategy or
   the enabling regulation, not a secondary CRS summary. Reconcile or state
   which count is current and why the other exists (pilot vs. steady-state
   authority is the likely explanation).
2. **OSC equity authority, pending legislation.** Track Section 1051 of the
   FY2027 NDAA through conference. One-line status check each quarter;
   flip the marker to VERIFIED (enacted) or drop the vehicle-directory
   mention if it dies in conference.
3. **EDU structure and mandate.** Thin by design so far. Worth a dedicated
   research pass once EDU makes its first public deal or hire announcement;
   until then, don't upgrade its confidence markers.
4. **NSIC leadership (Tex Schenkkan, STALE).** Check nsic.mil or DIU's
   public leadership page for the current director. Five-minute fix.
5. **DHS SVIP award ceiling and phase structure.** Pull the current phase
   structure directly from dhs.gov/science-and-technology/svip. Likely a
   quick fix; the earlier UNVERIFIED tag was caution, not a known dispute.
6. **DARPA Commercial Strategy Office scorecard, cumulative since 2018.**
   Ask DARPA's Commercial Strategy Office for a trailing-12-month cut if
   one exists, or note explicitly that only the cumulative figure is
   public.
7. **DoE Energy Dominance Financing, 2026 rename.** Confirm the program's
   current lending posture (is it originating new loans under the new
   name, or still transitioning) directly from energy.gov's loan programs
   page.
8. **SBIR/STTR outside Army/Navy/SOCOM.** Air Force, Space Force, and
   civil-agency SBIR/STTR are still named as an on-ramp only. If this gets
   the same treatment the Army/Navy/SOCOM block got, prioritize Space
   Force (SpaceWERX already has an entry, but its SBIR-specific mechanics
   aren't broken out) over Air Force (AFWERX is already well covered).
9. **The five new Army/Navy/SOCOM entries and the four coordination
   bodies.** Both blocks were built from live search, not primary .mil
   reading. Before external use: confirm AAL's placement under T2COM,
   confirm NavalX's current Tech Bridge site count, confirm the Navy's
   $30M rapid-funding BAA is still live, confirm SOFWERX's Engage SOF
   deadline hasn't moved, and pull current membership rosters for the
   National Security Capital Forum and the National Energy Dominance
   Council rather than relying on the launch-announcement rosters cited
   here.
10. **Sector-grid judgment calls (spine inheritance, EXIM/NSF
    cross-sector lighting, AUKUS placement).** These are structural
    inferences from each vehicle's own stated scope, not literal
    transcription. Worth a second pair of eyes before this map goes past
    internal use, specifically on whether AFVentures and NATO DIANA really
    belong on the Marine tab given neither is Navy-affiliated.
11. **AUKUS Pillar II US-company eligibility.** The biggest open question
    in the whole document. Call ASCA or DIU's AUKUS point of contact and
    ask directly: can a US company apply to the AUKUS Innovation Challenge
    series through the US leg, and on what terms? Until answered, keep the
    LOW openness rating.

## B. Map-quality to-dos found on this pass

- **Microelectronics (4.7) is the thinnest tab.** It hasn't had the kind of
  research pass Army/Navy/SOCOM and Coordination and policy got. Do that
  pass next; Commerce CHIPS Program Office deserves its own vehicle
  directory entry instead of being name-checked only in the sector prose.
- **Commerce CHIPS Program Office and the National Defense Stockpile**
  are both named repeatedly (matrix, Critical minerals, Microelectronics)
  but neither has a directory entry, so both render as unmapped chips.
  Give each a real entry or fold them explicitly into an existing one.
- **"Direct DoW stakes" and "service SBIR/STTR"** are the other two
  unmapped matrix tokens. "Direct DoW stakes" should probably just become
  an explicit cross-reference to section 6 (The equity shift) rather than
  its own token. "Service SBIR/STTR" could stay generic on purpose, since
  the map deliberately deprioritizes SBIR/STTR as a category.
- **Per-vehicle "last verified" date.** Right now confidence markers say
  *what* is uncertain but not *when* it was last checked. A small
  `last_checked` field per vehicle (rendered as a tiny date next to the
  heat/openness chips) would make the next refresh pass much faster to
  scope.
- **Directory filters have no text search.** With 24 entries, body/heat/
  openness dropdowns work, but a name search box would help once the
  directory grows past ~30 entries (likely once Microelectronics and any
  new sources below get built out).
- **Glossary coverage gap.** AUKUS-specific acronyms (ASCA, UKDI, ETL)
  aren't in the glossary. Low priority, but easy to add if AUKUS coverage
  expands.
- **No revision log in the document itself.** This map has gone through
  four real content revisions in one week (services expansion, structural
  cut, tooltips, sector remap). Worth a one-line "last revised" stamp
  in the header or footer so a reader printing a PDF later knows which
  pass they're holding.

## C. Federal capital sources not yet in the map

Ranked roughly by how likely each is to actually matter for a pre-seed or
seed national security company, since that's Rosc's stage. None of these
are in the document yet — treat every figure below as a lead to verify,
not a citable fact.

1. **Medical CBRN Defense Consortium (MCDC).** An Other Transaction
   Authority consortium under the Defense Health Agency for medical
   countermeasures against chemical, biological, radiological, and nuclear
   threats. Over $7.8B awarded since inception, explicitly open to biotech
   startups and SBIR performers alongside primes and academia, with
   regular open requests for prototype proposals. This is a real gap: the
   Biotech and biosecurity tab currently has no non-dilutive door besides
   DARPA BTO, and MCDC looks like exactly that door. **Highest-priority
   addition.**
2. **ARPA-E.** DoE's early-stage, non-dilutive energy technology program,
   already name-checked once in passing ("DoE's early-stage money runs
   through ARPA-E and grant FOAs") but never given its own directory
   entry. Award sizes run roughly $250K to $10M depending on program,
   explicitly targets technology "too early for private capital." Given
   Critical minerals is the sector with "the seed lane is genuinely
   sparse," a real ARPA-E entry could meaningfully change that read.
3. **Manufacturing USA institutes with a DoD tie.** A network of ~17
   public-private manufacturing institutes; the DoD-relevant ones are
   NextFlex (flexible electronics), MxD (digital manufacturing), BioMADE
   and BioFabUSA (bioindustrial manufacturing), and AFFOA (fibers and
   textiles). NextFlex is already running a DoW-funded special call
   (REARM) for munitions-industrial-base modernization. These are
   cost-share, project-based awards, not pure grants, but they're a real
   and currently absent hardware/biomanufacturing door.
4. **Missile Defense Agency (MDA) SBIR/STTR and OTA activity.** Currently
   folded into the generic, deliberately-unmapped "service SBIR/STTR"
   token. MDA runs real early awards and its own OTA activity; worth
   checking whether it deserves the same treatment NAVSEA got inside the
   ONR SBIR/STTR entry.
5. **DHS S&T beyond SVIP.** DHS Science and Technology also runs a
   Transition to Practice program and other R&D partnership mechanisms.
   Currently the map only carries SVIP. Low-to-medium priority given DHS
   is already framed as adjacent, not core, to this map's national
   security focus.
6. **National Security Innovation Network (NSIN).** DIU's sister
   organization, runs Hacking for Defense and the X-Force fellowship.
   Not a capital vehicle, doesn't write checks to companies, but is a
   real deal-flow and talent pipeline the way DARPA's Embedded
   Entrepreneur Initiative is. Would sit as "adjacent, not core," the
   same treatment BARDA/DTRA/JPEO-CBRND already get.

### State programs (secondary; the map's focus stays federal)

Flagged because they were asked about, not because they're being proposed
as a new section. If a state layer ever gets built, these are the leads:

- **Massachusetts.** MassVentures runs the state's own SBIR/STTR Phase I
  matching grant (roughly up to $50K matching a federal Phase I award).
  MA already appears in this map as a NATO DIANA accelerator site
  (MassChallenge, Boston), so there's a natural tie-in.
- **Texas.** The Texas Space Commission (created 2023) makes state grants
  to space-industry companies and research; worth checking current award
  activity given Texas's growing defense-tech and space presence.
- **California.** No single centralized state match program comparable to
  Massachusetts's; state-level defense-tech capital in CA runs more
  through regional or university-affiliated efforts than a single state
  fund. Lowest priority of the three to build out.
