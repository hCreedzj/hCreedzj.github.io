(function() {

    "use strict";

    const root = document.documentElement;
    const navToggle = document.querySelector("#js-navToggle");

    navToggle.addEventListener("click", function() {
        root.classList.toggle("show-nav");
    });


    const eventPP = document.querySelector("#js-eventPP");

    if (eventPP) {

        const eventOpenBtn = document.querySelector("#js-eventOpenBtn");

        const closeEventPP = function(event) {
            function close() {
                document.removeEventListener("keyup", closeEventPP);
                eventPP.removeEventListener("click", closeEventPP);

                root.classList.remove("show-event-popup");
            };

            switch(event.type) {
                case "keyup":
                if (event.key === "Escape") {
                    close();
                    break;
                }

                case "click":
                if (
                    event.target === this ||
                    event.target.classList.contains("js-ppCloseBtn")
                ) {
                    close();
                    break;
                }
            }
        };


        eventOpenBtn.addEventListener("click", function() {
            root.classList.add("show-event-popup");

            document.addEventListener("keyup", closeEventPP);
            eventPP.addEventListener("click", closeEventPP);
        });

    }

    let swipers = document.querySelectorAll(".js-swiper");
    swipers.forEach(function(swpr) {
        console.log("swiper:", swpr);
        console.log("next:", swpr.querySelector(".swiper-arrow-next"));
        console.log("prev:", swpr.querySelector(".swiper-arrow-prev"));
        console.log("pagination:", swpr.querySelector(".swiper-pagination"));


        new Swiper(swpr, {
            updateOnWindowResize: true,
            slidesPerView: "auto",
            freeMode: true,
            
            spaceBetween: 0,
            speed: 500,
            grabCursor: true,

            pagination: {
                el: swpr.querySelector(".swiper-pagination"),
                clickable: true,
            },
            navigation: {
                nextEl: swpr.querySelector(".swiper-arrow-next"),
                prevEl: swpr.querySelector(".swiper-arrow-prev"),
                disabledClass: "arrow--disabled"
            }

        });
    });




    const contactsMap = document.querySelector("#js-contactsMap");

    if (contactsMap) {

        // Координаты центра
        const centerCoordinates = ol.proj.fromLonLat([
            84.972386,
            56.459641,
        ]);

        // Слой OpenStreetMap
        const tileLayer = new ol.layer.Tile({
            source: new ol.source.OSM(),
        });

        // Представление карты
        const view = new ol.View({
            center: centerCoordinates,
            zoom: 15,
            projection: "EPSG:3857",
            enableRotation: false,
        });

        // Источник маркера
        const vectorSource = new ol.source.Vector({
            features: [
                new ol.Feature({
                    geometry: new ol.geom.Point(centerCoordinates),
                }),
            ],
        });

        // Стиль маркера
        const iconStyle = new ol.style.Style({
            image: new ol.style.Icon({
                src: "/assets/icons/logo.svg",
                anchor: [0.5, 0.5],
                size: [80, 58],
                
            }),
        });

        // Слой с маркером
        const vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: iconStyle,
        });

        // Инициализация карты
        const map = new ol.Map({
            target: contactsMap,
            layers: [tileLayer, vectorLayer],
            view: view,
        });
    }

    const jsSelectric = $(".js-selectric");
    if (jsSelectric.length) {
        jsSelectric.selectric({
            nativeOnMobile: false
        });
    }

    const mobileMask = $(".js-mobileMask");
    if (mobileMask.length) {
        mobileMask.mask('+ 7 (000) 000 00 00', {
            placeholder: "+7 (___) ___ __ __"
        });
    }

    const dateField = $(".js-dateField");

if (dateField.length) {
    const pickerInit = function (pick) {
        let dateInput = pick.find(".js-dateInput");
        let dateDay = pick.find(".js-dateDay");
        let dateMonth = pick.find(".js-dateMonth");
        let dateYear = pick.find(".js-dateYear");

        const dateConfig = {
            container: "#js-eventPP",
            autoClose: true,
            minDate: new Date(),

            navTitles: {
                days: "MMMM <i>yyyy</i>"
            },

            onSelect: function({date}) {
                dateDay.val(
                    date ? ("0" + date.getDate()).slice(-2) : ""
                );

                dateMonth.val(
                    date ? ("0" + (date.getMonth() + 1)).slice(-2) : ""
                );

                dateYear.val(
                    date ? date.getFullYear() : ""
                );
            },
        };

        new AirDatepicker(dateInput[0], dateConfig);
    };

    $.each(dateField, function(i) {
        pickerInit($(this));
    });
}

})();