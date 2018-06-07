var initialLocations = [
  {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
  {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465},show:'map'},
  {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
  {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
  {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
  {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
  ];
var newsUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=ea0ba2495c4f4c6393675b9ec65bdb7f&q=";

var loadView = ko.observable("none");

var mapInitError = function () {
    alert("地图加载失败");
};
var map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 40.7413549, lng: -73.9980244},
  zoom: 13,
  mapTypeControl: true
  });

var markerList = ko.observableArray([]);

var Locations = function(data) {
  self = this;
  this.position = data.location;
  this.title = data.title;
  this.marker = new google.maps.Marker({
    position:self.position,
    title:self.title,
    /*animation:google.maps.Animation.DROP,*/
    map:map
  });
  this.largeInfowindow = new google.maps.InfoWindow();
  this.marker.addListener('click', (function(marker,infowindow) {
   return function() {
      if (infowindow.marker != marker) {
        infowindow.marker = marker;
        /*infowindow.setContent('<div>' + marker.title + '</div>');*/
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
      map.setCenter(marker.getPosition());
      $.ajax({
            url: newsUrl + marker.title,
            dataType: "json",
            timeout: 5000,
            beforeSend: function () {
                loadView('block')
            },
            complete: function () {
                loadView('none')
            }
      }).done(function (data) {
            infowindow.setContent(data.response.docs[0].snippet);
            infowindow.open(map,marker);
        }).fail(function () {
            alert("加载出错");
        })
      }
    };
  })(self.marker,self.largeInfowindow));
}




var ViewModel = function() { 
  this.name = ko.observable("");
  markerList = ko.computed(function(){
    var markerList1 = [];
    for(let i=0;i<markerList().length;i++){
      markerList()[i].marker.setMap(null);
    }
    var com = this.name();
    if (!com) {
      initialLocations.forEach(function(lacationItem) {
        markerList1.push(new Locations(lacationItem));
      });
    } else {
      initialLocations.forEach(function(lacationItem){
        if ((lacationItem.title.indexOf(com)) != -1){
          markerList1.push(new Locations(lacationItem));
        } 
      });
    }
    return markerList1;
  },this);
  self = this;
  this.menuView = ko.observable('');
  this.showButton = ko.observable('');
  this.buttonText = ko.observable('显示菜单')
  this.openMenu = function() {
    if ( $('.menu-showButton').html() === "显示菜单" ){
      this.menuView('0');
      this.buttonText('隐藏菜单');
    } else {
      this.menuView('-300px');
      this.buttonText('显示菜单');
          };
    };
}

ko.applyBindings(new ViewModel());
















