import { useState, useRef, useEffect } from 'react';

const MEDICINES_RAW = [
  "ABEL MOSCHUS", "ABIES CAN.", "ABIES NIG.", "ABROMA AUG.", "ABROTANUM", "ABSINTHIUM",
  "ACALPYHA INDICA", "ACID ACETIC", "ACID BENZOIC", "ACID BORIC", "ACID BUTYRICUM",
  "ACID CITRIC", "ACID CARB.", "ACID FLUORIC", "ACID FORMIC", "ACID GALLICUM",
  "ACID HYDROCYANIC", "ACID LACTICUM", "ACID MUR.", "ACID NITRICUM", "ACID OXALIC",
  "ACID PHOS", "ACID PICRIC", "ACID SALICYLIC", "ACID SARCOLACTIC", "ACID SUCCINICUM",
  "ACID SULPH", "ACID TANNIC", "ACID TART.", "ACONITE NAP.", "ACTEA SPICIATA", "ACTH",
  "ADONIS VER.", "ADRENALINUM", "AEGLE FOLIA", "AESCULUS GLABRA", "AESCULUS HIPP.",
  "AETHUSA CYN.", "AGARICUS MUSC.", "AGAVE AMERIC", "AGNUS CASTUS", "ALETRIS FAR.",
  "ALFALFA", "ALLIUM CEPA", "ALLIUM SAT.", "ALNUS RUBRA", "ALOE SOC.", "ALSTONIA CON.",
  "ALUMEN", "ALUMINA", "AMBRA GRISEA", "AMMONIUM ACET", "AMMONIUM CARB", "AMMONIUM CAUSTICUM",
  "AMMONIUM MUR", "AMMONIUM PHOS", "AMMONIUM PICRIC", "AMYLENUM NITROSUM", "ANACARDIUM OCC.",
  "ANACARDIUM ORI.", "ANAGALLIS ARV.", "ANGUSTURA VERA", "ANTHRACINUM", "ANTHRAKOKALI",
  "ANTIM. CRUD.", "ANTIM. TART.", "APIS MEL.", "APIUM GRAV", "ARALIA RACEMOSA",
  "ARANEA DIADEMA", "ARGENTUM MET.", "ARGENTUM NIT.", "ARGENTUM PHOS", "ARJUNA",
  "ARNICA MONT", "ARS. SULPH. FLAV.", "ARSENIC ALB.", "ARSENIC IOD.", "ARSENIC SULPH. RUB.",
  "ARTEMISIA VULG", "ARUM MUR.", "ARUM TRIPHYLLUM", "ARUNDO MAURIT.", "ASAFOETIDA",
  "ASHOKA JAN.", "ASPARAGUS OFF.", "ASPERULA ODORATA", "ASPIDOSPERMA", "ASHWAGANDHA",
  "ATROPINUM SULPH.", "AURUM IODAT.", "AURUM MET.", "AURUM MUR. NAT.", "AURUM SULPH",
  "AVENA SATIVA", "AZADIRACHTA IND.", "BACILLINUM", "BADIAGA", "BALSAMUM PERU.",
  "BAPTISIA TINCT.", "BARYTA CARB.", "BELLADONNA", "BELLIS PER.", "BENZENUM",
  "BERBERIS AQUIF.", "BERBERIS VULG.", "BISMUTHUM CARB", "BISMUTHUM MET.", "BLATTA AMERICANA",
  "BLATTA ORIENTALIS", "BOERHAVIA DIFF.", "BORAX", "BOTHROPS LAN.", "BOVISTA", "BROMIUM",
  "BRYONIA ALBA", "BUFO RANA.", "CACTUS GRAND", "CADMIUM SULPH.", "CALADIUM", "CALC ARS.",
  "CALC BROMATA", "CALC CARB.", "CALC FLOUR.", "CALC HYPOPHOS", "CALC IODAT", "CALC MUR.",
  "CALC PHOS", "CALC SULPH", "CALCAREA RENALIS", "CALENDULA OFF.", "CALOTROPIS GIG.",
  "CAMPHORA OFF.", "CANNABIS IND.", "CANNABIS SATIVA", "CANTHARIS", "CAPSICUM",
  "CARBO ANIMALIS", "CARBO VEG.", "CARBONEUM SULPH", "CARCINOSINUM", "CARDUUS MAR.",
  "CARICA PAPAYA", "CROTON TIG.", "CASCARA SAGRADA", "CASCARILLA", "CASSIA SOPHORA",
  "CASTOREUM", "CAULOPHYLLUM", "CAUSTICUM", "CEANOTHUS AMERIC", "CEDRON", "CEPHALANDRA INDICA",
  "CERIUM MUR.", "CERIUM OXALICUM", "CHAMOMILLA", "CHAPARRO AMARGO", "CHELIDONIUM MAJ.",
  "CHELONE GLABRA", "CHENOPODIUM ANTH.", "CHERIANTHUS CHEIRI", "CHIMAPHILA UMB.", "CHINA OFF.",
  "CHININUM SULPH", "CHINIUM ARS.", "CHIONANTHUS VIRG.", "CHIRATA", "CHLORALUM HYDRAT.",
  "CHLOROFORM", "CHOLESTERINUM", "CHRYSAROBINUM", "CICUTA MAC.", "CICUTA VIROSA", "CIMEX",
  "CIMICIFUGA RACE.", "CINA ARTEM.", "CINERARIA MARITIMA", "CINNABARIS", "CINNAMONUM",
  "CISTUS CAN.", "CLEMATIS ERECTA", "CLEMATIS VIT.", "COBALTUM NIT.", "COCA", "COCCULUS IND.",
  "COCCUS CACTI", "CODEINUM", "COFFEA CRUD.", "COLCHICINUM", "COLCHICUM", "COLLINSONIA CAN.",
  "COLOCYNTHINUM", "COLOCYNTHIS", "CONDURANGO", "CONIUM MAC.", "CONVALLARIA MAJ.", "COPAVIA OFF.",
  "CORALLIUM RUB.", "CROCUS SAT.", "CORTISONE", "CRATAEGUS OXY.", "CROTALUS HORRIDUS",
  "CUBEBA OFF.", "CUPRUM MET", "D.N.A.", "DAMIANA", "DAPHNE IND.", "DESMODIUM", "DHAMASA",
  "DIGITALIS PURP.", "DIOSCOREA VILL.", "DOLICHOS PRU.", "DOPAMINE", "DROESERA ROT",
  "DULCAMARA", "ECHINACEA ANG.", "ECHINACEA PUR.", "EEL SERUM", "EMBELIA RIBES", "EPHEDRA VULG",
  "EPIGEA REPENS", "EQUISETUM HYE.", "ERIGERON CAN.", "ERIODICYTON GLUT.", "EUCALYPTUS GLOP",
  "EUONYMUS ATROP.", "EUPATORIUM PERF.", "EUPATORIUM PURP.", "EUPHORBIA HYP.", "EUPHORBIA PIL",
  "EUPHORBIUM", "EUPHRASIA OFF.", "EUPIONUM", "FABIANA (PICHI)", "FAGOPYRUM", "FEL TAURI",
  "FERRUM ACET", "FERRUM ARS.", "FERRUM BROM", "FERRUM IODATUM", "FERRUM MET.", "FERRUM MUR.",
  "FERRUM PHOS", "FERRUM SULPH", "FICUS INDICA", "FICUS RELIG.", "FILIX MAS.", "FOLLICULINUM",
  "FORMICA RUFA", "FRAGARIA VES.", "FRAXINUS AM.", "FSH", "FULIGO LIGNI", "GALLIUM APAR",
  "GAMBOGIA", "GAULTHERIA PROCUMB", "GELSEMIUM", "GENTIANA LUT.", "GINKGO BILOBA", "GINSENG",
  "GLONOINE", "GLYCERINUM", "GNAPHALIUM", "GOSSYPIUM", "GRANATUM", "GRAPHITES", "GRATIOLA OFF.",
  "GRINDELIA ROB.", "GUAIACUM OFF.", "GUNPOWDER", "GYMNEMA SYLV.", "HAMAMELIS VIRG.", "HCG",
  "HEKLA LAVA", "HELIANTHUS ANN.", "HELLEBORUS NIG.", "HELONIAS DIO.", "HEPAR SULPH",
  "HISTAMINUM", "HYDRANGEA ARB.", "HYDRASTIS CAN.", "HYDROCOTYLE AS.", "HYDROPHYLLUM",
  "HYGROPHILLA SPIN", "HYOSCYAMUS NIG.", "HYPERICUM", "HYPOTHALAMUS", "IGNATIA", "INDIGO",
  "INDIUM MET", "INFLUENZINUM", "INSULINUM", "INULA HEL.", "IODIUM", "IPECACUANHA",
  "IRIDIUM MET", "IRIS VERSICOLOR", "JABORANDI", "JACARANDA", "JALAPA", "JATROPHA CURCAS",
  "JUGLANS REG.", "JUNIPERUS COM.", "JUNIPERUS VIRG.", "JUSTICIA ADH.", "KALMEGH", "KALI ACET",
  "KALI ARS.", "KALI BICHROM", "KALI CARB", "KALI CAUST", "KALI IOD.", "KALI MUR.", "KALI NIT.",
  "KALI OXALIC", "KALI PHOS", "KALI SULPH", "KALMIA", "KREOSOTUM", "KURCHI", "LAC CANINUM",
  "LAC DEFLORATUM", "LACHNANTHES TINC.", "LACHESIS", "LACITHINUM", "LACTUCA VIROSA",
  "LAPIS ALBUS", "LATHYRUS SAT.", "LATRODECTUS MACTA", "LAUROCERASUS", "LEDUM PAL.",
  "LEMNA MINOR", "LILIUM TIG.", "LITHIUM CARB.", "LITHIUM MUR.", "LOBELIA INF", "LUFFA AMARA",
  "LYCOPODIUM", "LUTEINISING HORMONE", "LYCOPUS VIRG", "MACROTIUM", "MAG. CARB", "MAG. MUR",
  "MAG. PHOS", "MALARIA OFF.", "MANGANUM ACET.", "MANGANUM PHOS", "MANGANUM SULPHURICUM",
  "MEDORRHINUM", "MELATONINE", "MENTHA PIP.", "MENTHOL", "MEPHITES METHITICA", "MEPHITES PUT.",
  "MERC ACET", "MERC CORR.", "MERC DULCIS", "MERC IOD. FLAV.", "MERC IOD. RUBER", "MERC SOL.",
  "MERC SUB CORR", "MEZEREUM", "MILLEFOLIUM", "MORPHINUM", "MOSCHUS", "MUREX PURP",
  "MYRISTICA SEB", "MYRTUS COM.", "NAJA TRI.", "NAPHTHALINUM", "NATRUM CARB", "NATRUM IOD.",
  "NATRUM MUR", "NATRUM NIT.", "NATRUM PHOS", "NATRUM SALIC", "NATRUM SULPH", "NUX MOSCHATA",
  "NUX VOMICA", "OCIMUM CAN.", "OCIMUM SAN.", "OENANTHE CRO.", "OESTROGEN CONJUGATED",
  "OLEUM JEC. ASEL.", "OLEUM RIC.", "ONOSMODIUM VIRG", "OOPHORINUM", "OPIUM", "ORCHITINUM",
  "ORIGANUM MAJ.", "ORNITHOGALUM UMB", "OSMIUM MET.", "OVA TOSTA", "OXYDENDRON ARB",
  "OXYTOCIN", "PAEONIA OFF.", "PALLADIUM", "PANCREATINUM", "PARATHYROIDINUM", "PARAFFINUM",
  "PAREIRA BRAVA", "PARODITINUM", "PASSIFLORA INC.", "PENCILLINUM", "PENTHORUM SEDOIDES",
  "PEPSINUM", "PETROSELINUM", "PETROLEUM", "PHOSPHORUS", "PHYSOSTIGMA", "PHYTOLACCA DEC.",
  "PHYTOLACCA BERRY", "PICHI", "PICRORHIZA KURROA", "PINUS LAMB.", "PIPER NIGRUM",
  "PITITUITARY WHOLE", "PIX LIQUIDA", "PLANTAGO MAJ.", "PLATINUM MET.", "PLUMBUM ARS",
  "PLUMBUM IOD.", "PLUMBUM MET.", "PODOPHYLLUM", "POLYPORUS SANICOLA", "POTHOS FOET.",
  "PRIMULA VERIS", "PROGESTERON", "PROLECTIN", "PRUNUS SPIN", "PRUNUS VIRG.",
  "PSORALEA COR. (BABCHI)", "PSORINUM (LUESINUM)", "PULSATILLA NIG.", "PYROGENIUM",
  "QUASSIA AMARA", "QUILLAYA SAPONARIA", "R.N.A.", "RADIUM BROM", "RANUNCULUS BULB",
  "RAPHANUS SAT", "RATANHIA", "RAUWOLFIA SER.", "RHODEDENDRON", "RHUS TOX.", "RICINUS COM.",
  "ROBINIA PSEUD", "RUBIA TINCTORIUM", "RUMEX CRISP.", "RUTA GRAV.", "SABADILLA", "SABAL SERR.",
  "SABINA", "SACCHARUM OFF.", "SALVIA OFF.", "SALIX ALBA", "SALIX NIGRA", "SAMBUCUS CAN.",
  "SAMBUCUS NIG.", "SANGUINARIA", "SANICULA AQUA", "SANTONINUM", "SAPONARIA OFF.", "SARKANDA",
  "SARSAPARILLA", "SCIRRHINUM", "SCROPHULARIA NODOSA", "SCUTELLARIA LAT.", "SECAL COR.",
  "SELENIUM", "SENECIO AUR.", "SENEGA", "SENNA", "SEPIA", "SEROTONIN", "SILICEA", "SINAPIS ALB.",
  "SINAPIS NIG.", "SKOOKUM CHUCK", "SOLANUM NIG", "SOLIDAGO VIRG.", "SPARTEINUM SULP",
  "SPIGELIA ANTH.", "SPONGIA TOSTA", "STAPHYSAGRIA", "STRAMONIUM", "STRONTIUM CARB",
  "STROPHANTHUS ARS.", "SULPHUR", "SULPHUR IOD.", "SUMBUL", "SYMPHYTUM OFF.", "SYPHILINUM",
  "SYZYGIUM JAMB.", "TABACUM", "TARAXACUM OFF", "TARENTULA HISP.", "TELLURIUM MET.",
  "TEREBINTHINA", "TESTOSTERONE", "TEUCRIUM MARUM", "THIOSINAMINUM", "THLASPI BURSA PAST.",
  "THUJA OCC.", "THYMOL", "THYMUS VULG.", "THYROIDINUM", "TINOSPORA CORD", "TITANIUM METALLICUM",
  "TRIBULUS TERR.", "TRIFOLIUM PRAT", "TRIFOLIUM REP.", "TUBERCULINUM", "TUSSILAGO FAR.",
  "TYPHODINUM", "URANIUM NIT.", "UREA", "URTICA URENS", "USNEA BARB.", "USTILAGO MAYD.",
  "UVA URSI", "VACCINIUM MYR.", "VALERIANA OFF.", "VANADIUM MET.", "VARIOLINUM", "VERATRUM VIR.",
  "VERATURM ALB.", "VERBASCUM", "VIBURNUM OP.", "VIOLA ODORATA", "VIOLA TRIC.", "VISCUM ALB.",
  "WIESBADEN", "WYETHIA HELE.", "XANTHOXYLUM FR.", "XEROPHYLLUM", "X-RAY", "YOHIMBINUM",
  "ZINCUM ACET", "ZINCUM MET.", "ZINCUM PHOS", "ZINCUM SULPH", "ZINCUM VAL.", "ZINGIBER OFF.",
  "ABIES CANADENSIS", "ABIES NIGRA", "ABROMA AUGUSTA", "ACALYPHA INDICA", "ACHYRANTHES",
  "ACIDUM ACETICUM 1CH", "ACIDUM BENZOICUM 1CH", "ACIDUM BUTYRICUM 2CH", "ACIDUM CARBOLICUM 1CH",
  "ACIDUM HYDROFLOURICUM 3DH", "ACIDUM LACTICUM 1CH", "ACIDUM MURIATICUM 1CH", "ACIDUM NITRICUM 1CH",
  "ACIDUM OXALICUM 1CH", "ACIDUM PHOSPHORICUM 1DH", "ACIDUM PICRICUM 1CH", "ACONITE NAPELLUS",
  "AESCULUS HIPPOCASTANUM", "AETHUSA", "AGARICUS MUSCARIUS", "ALETRIS FARINOSA", "ALLIUM SATIVUM",
  "ALUMEN 1DH", "ALUMINA 1DH", "ALOE SOCOTRINA", "ALSTONIA SCHOLARIS", "ALTHEA OFFICINALIS",
  "AMLOKI - EMBELIA OFF", "AMMONIUM CARBONICUM 1CH", "AMMONIUM IODATUM 1CH", "AMMONIUM MURIATICUM 1CH",
  "AMYLENUM NITROSUM 1CH", "ANACARDIUM ORIENTALE", "ANTIMONIUM CRUDUM 1DH", "ANTIMONIUM TARTARICUM 3CH",
  "APIS MELLIFICA", "APOCYNUM CANNABINUM", "ARGNETUM NITRICUM 1CH", "ARNICA MONTANA",
  "ARSENICUM ALBUM 3DH", "ARSENICUM BROMATUM 4CH", "ARTEMISIA VULGARIS", "ATROPINUM SULPHURICUM 2CH",
  "BALSAMUM PERUVIANUM", "BAPTISIA TINCTORIA", "BARYTA MURIATICA 1CH", "BELLIS PERENNIS",
  "BENZINUM NITRICUM 1DH", "BERBERIS AQUIFOLIUM", "BLATTA ORIENTALIS", "BOERHAVIA DIFFUSA",
  "BORAX 1DH", "BROMIUM 2CH", "BRYONIA ALBA", "CACTUS GRANDIFLORUS", "CADMIUM SULPHURATUM 1CH",
  "CALENDULA", "CALOTROPIS GIGANTEA", "CAMPHORA 1DH", "CANNABIS INDICA", "CANTHARIS",
  "CAPSICUM ANNUUM", "CARDUUS MARIANUS", "CASCARA SAGRADA", "CASSIA SOPHORA", "CAULOPHYLLUM",
  "CAUSTICUM 3CH", "CEANOTHUS", "CEPHALANDRA INDICA", "CHAPARRO AMARGOSO", "CHEIRANTHUS CHEIRI",
  "CHELIDONIUM MAJUS", "CHENOPODIUM ANTHELMINTICUM", "CHIMAPHILA UMBELLATA", "CHINA OFFICINALIS",
  "CHIONANTHUS VIRGINICA", "CHLOROFORM 1CH", "CHOLESTERINUM 3DH", "CICHORIUM INTYBUS",
  "CIMICIFUGA", "CINA ARTEMISIA", "CINERARIA MARITIMA", "CISTUS CANADENSIS", "COCCULUS INDICUS",
  "COCCUS CACTI", "COFFEA CRUDA", "COLCHICUM", "COLLINSONIA", "COLOCYNTHIS", "CONDURANGO",
  "CONIUM MACULATUM", "CONVALLARIA MAJALIS", "COPAIVA", "CRATAEGUS", "CROCUS SATIVA",
  "CROTON TIGLIUM", "CUBEBA", "DIOSCOREA", "DOLICHOS", "DROSERA", "DULCAMARA",
  "ECHINACEA ANGUSTIFOLIA", "EMBELIA RIBES", "EPHEDRA VULGARIS", "EPIGEA REPENS",
  "EQUISETUM HYEMALE", "EUCALYPTUS GLOBULUS", "EUPATORIUM PERFOLIATUM", "EUPATORIUM PURPUREUM",
  "EUPHORBIUM OFFICINALIS", "EUPHRASIA OFF", "FICUS INDICA", "FILIX MAS", "FORMICA RUFA",
  "FRAXINUS AMERICANA", "FUCUS VESICULOSUS", "GALEGA", "GALIUM APARINE", "GAULTHERIA PROCUMBENS",
  "GENTIANA LUTEA", "GERANIUM MACULATUM", "GINKGO BILOBA", "GLONOINE 2CH", "GLYCERINE 1DH",
  "GNAPHALIUM", "GOSSYPIUM", "GRANATUM", "GRINDELIA ROBUSTA", "GUAIACUM", "GYMNEMA SYLVESTRE",
  "HAMAMELIS", "TERMINALIA CHEBULA - HARITAKI", "HELIANTHUS", "HELLEBORUS NIGER", "HELONIAS DIOICA",
  "HYDRANGEA", "HYDRASTIS CANADENSIS", "HYDROCOTYLE", "HYOSCYAMUS", "HYPERICUM PERF",
  "IODIUM 1CH", "IPECACUANHA", "IRIS VERSICOLOR", "JALAPA", "JUGLANS REGIA", "JUNIPERUS COMMUNIS",
  "JUSTICIA", "KALI BICHROMICUM 2CH", "KALI BROMATUM 1CH", "KALI CARBONICUM 1CH", "KALI IODATUM 1CH",
  "KALI SULPHURICUM 3DH", "KALMIA", "KREOSOTUM 1CH", "KURCHI", "LAUROCERASUS", "LECITHIN 3DH",
  "LEDUM PALUSTRE", "LEMNA MINOR", "LEPTANDRA VIRGINICA", "LITHIUM CARBONICUM 3DH", "LOBELIA INFLATA",
  "LYCOPODIUM", "LYCOPUS VIRGINICUS", "MAGNESIA MURIATICA 3DH", "MANGANUM MURIATICUM 1CH",
  "MEZEREUM", "MILLEFOLIUM", "MORINGA OLEIFERA", "MOSCHUS 2CH", "MYRICA CERIFERA", "NUPHAR LUTEUM",
  "NUX MOSCHATA", "NUX VOMICA", "OCIMUM CANUM", "OLEANDER", "OLEUM JECORIS ASELLI 3DH",
  "ONOSMODIUM", "OPUNTIA VULGARIS", "ORIGANUM", "PAEONIA", "PAREIRA BRAVA", "PASSIFLORA",
  "PEPSINUM 3CH", "PETROLEUM 1CH", "PETROSELINUM", "PHOSPHORUS 3CH", "PHYSOSTIGMA",
  "PHYTOLACCA BERRIES", "PHYTOLACCA DECANDRA", "PICHI (FABIANA)", "PINUS LAMBERTIANA",
  "PIPER NIGRUM", "PISCIDIA", "PLANTAGO MAJOR", "PODOPHYLLUM", "PSORALEA CORYLIFOLIA",
  "PULSATILLA", "RANUNCULUS BULBOSUS", "RAPHANUS", "RATANHIA", "RAUWOLFIA", "RHUS TOXICODENDRON",
  "RICINUS COMMUNIS", "ROBINIA", "RUBIA TINCTORUM", "RUMEX CRISPUS", "RUTA", "SABADILLA",
  "SABAL SERRULATA", "SABINA", "SALIX NIGRA", "SAMBUCUS NIGRA", "SANGUINARIA", "SARSAPARILLA",
  "SCROPHULARIA NODOSA", "SCUTELLARIA", "SECALE CORNUTUM", "SENECIO AUREUS", "SENEGA", "SENNA",
  "SEPIA 1C", "SINAPIS ALBA", "SINAPIS NIGRA", "SOLANUM NIGRUM", "SOLANUM XANTHOCARPUM",
  "SOLIDAGO", "SPIGELIA ANTHELMIA", "SPONGIA", "STAPHYSAGRIA", "STICTA PULMONARIA",
  "STROPHANTHUS HISPIDUS", "STRAMONIUM", "SULPHUR 3DH", "SUMBUL", "SYMPHYTUM", "SYZYGIUM JAMBOLUM",
  "TABACUM", "TARAXACUM", "TEREBINTHINA 1CH", "TEUCRIUM MARUM", "THLASPI BURSA PASTORIS",
  "THUJA OCCIDENTALIS", "THYMOL 3CH", "TRIBULUS TERRESTRIS", "TUSSILAGO FARFARA",
  "URANIUM NITRICUM 3DH", "URTICA URENS", "USNEA BARBATA", "USTILAGO", "UVA URSI", "VALERIANA",
  "VERATRUM ALBUM", "VERATRUM VIRIDE", "VERBASCUM", "VESICARIA COMMUNIS", "VIBURNUM OPULUS",
  "VIOLA ODORATA", "VISCUM ALBUM", "YOHIMBINUM", "ZINGIBER OFFICINALE"
];

// Remove duplicates and prefer full names over abbreviated ones
const MEDICINES = [...new Set(MEDICINES_RAW)]
  .filter((medicine, index, arr) => {
    // Check if there's a longer version of this medicine name
    const longerVersionExists = arr.some(other => 
      other !== medicine && 
      other.length > medicine.length && 
      other.toLowerCase().startsWith(medicine.toLowerCase().replace(/\.$/, ''))
    );
    return !longerVersionExists;
  })
  .sort();

export default function MedicineAutocomplete({ value, onChange, required = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef();

  useEffect(() => {
    if (value && value.trim().length > 0) {
      const filtered = MEDICINES.filter(medicine =>
        medicine.toLowerCase().includes(value.toLowerCase().trim())
      ).slice(0, 8); // Limit to 8 results for better UI
      setFilteredMedicines(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredMedicines([]);
      setIsOpen(false);
    }
    setHighlightedIndex(-1);
  }, [value]);

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };



  const handleSelectMedicine = (medicine) => {
    onChange(medicine);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredMedicines.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredMedicines.length) {
          handleSelectMedicine(filteredMedicines[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleBlur = (e) => {
    // Delay closing to allow clicking on dropdown items
    setTimeout(() => {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }, 200);
  };

  const [dropdownPosition, setDropdownPosition] = useState({ top: '100%', bottom: 'auto' });

  const calculateDropdownPosition = () => {
    if (inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 250; // max height of dropdown
      
      // Check if there's enough space below the input
      const spaceBelow = viewportHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;
      
      if (window.innerWidth <= 768) {
        // Mobile positioning - always show below input with fixed positioning
        setDropdownPosition({ 
          top: inputRect.bottom + 5, 
          bottom: 'auto',
          maxHeight: Math.min(spaceBelow - 10, dropdownHeight) + 'px',
          left: 16,
          right: 16
        });
      } else {
        // Desktop positioning
        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
          // Not enough space below, show above
          setDropdownPosition({ 
            top: 'auto', 
            bottom: '100%',
            maxHeight: Math.min(spaceAbove - 10, dropdownHeight) + 'px'
          });
        } else {
          // Show below (default)
          setDropdownPosition({ 
            top: '100%', 
            bottom: 'auto',
            maxHeight: Math.min(spaceBelow - 10, dropdownHeight) + 'px'
          });
        }
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Add a small delay to ensure DOM is updated
      setTimeout(() => calculateDropdownPosition(), 10);
      const handleResize = () => calculateDropdownPosition();
      const handleScroll = () => calculateDropdownPosition();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isOpen]);

  return (
    <div className="autocomplete-wrapper" style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        className="form-control"
        placeholder="e.g., Arnica"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={() => {
          if (value && value.trim().length > 0) {
            const filtered = MEDICINES.filter(medicine =>
              medicine.toLowerCase().includes(value.toLowerCase().trim())
            ).slice(0, 8);
            if (filtered.length > 0) {
              setFilteredMedicines(filtered);
              setIsOpen(true);
              // Trigger position calculation after opening
              setTimeout(() => calculateDropdownPosition(), 10);
            }
          }
        }}
        required={required}
        autoComplete="off"
      />
      {isOpen && filteredMedicines.length > 0 && (
        <div 
          className="autocomplete-dropdown"
          style={{
            position: window.innerWidth <= 768 ? 'fixed' : 'absolute',
            top: window.innerWidth <= 768 ? 
              (typeof dropdownPosition.top === 'number' ? dropdownPosition.top + 'px' : dropdownPosition.top) : 
              dropdownPosition.top,
            bottom: dropdownPosition.bottom,
            left: window.innerWidth <= 768 ? (dropdownPosition.left || 16) + 'px' : 0,
            right: window.innerWidth <= 768 ? (dropdownPosition.right || 16) + 'px' : 'auto',
            width: window.innerWidth <= 768 ? 'auto' : '100%',
            maxWidth: window.innerWidth <= 768 ? 'calc(100vw - 2rem)' : 'none',
            zIndex: 9999,
            maxHeight: dropdownPosition.maxHeight || '250px',
            overflowY: 'auto',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
          }}
        >
          {filteredMedicines.map((medicine, index) => (
            <div
              key={medicine}
              className="autocomplete-item px-3 py-2"
              style={{ 
                cursor: 'pointer',
                backgroundColor: index === highlightedIndex ? '#667eea' : 'transparent',
                color: index === highlightedIndex ? 'white' : '#333',
                transition: 'all 0.2s ease',
                padding: '12px 16px',
                borderRadius: '8px',
                margin: '4px 8px',
                fontSize: '0.9rem',
                fontWeight: '500',
                // Better touch targets
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseDown={(e) => e.preventDefault()} // Prevent input blur
              onClick={() => handleSelectMedicine(medicine)}
              onMouseEnter={() => setHighlightedIndex(index)}
              onTouchStart={() => setHighlightedIndex(index)} // Better touch support
            >
              {medicine}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 