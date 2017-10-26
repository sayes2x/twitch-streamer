var streamers = {},
  streamsHTML = "";
$(document).ready(function() {
  var state = "All";
  channelInfo();
  $('ul').on({
    mouseenter: function() {
      if(state !== $(this).find('span').last().text()) {
        $(this).addClass('wide').removeClass('narrow');
        $(this).find('span').last().addClass('visable').removeClass('hidden');
      }
    },
    mouseleave: function() {
      if(state !== $(this).find('span').last().text()) {
        $(this).addClass('narrow').removeClass('wide');
        $(this).find('span').last().addClass('hidden').removeClass('visable');
      }
    },
    click: function() {
      state = $(this).find('span').last().text();
      $(this).parent().find('li').trigger('mouseleave');
      console.log('clicked' + ' ' + state);
      if(state === 'Online') {
        $('#response').find('.offline').slideUp();
        $('#response').find('.online').slideDown();
      } else if(state === 'Offline') {
        $('#response').find('.offline').slideDown();
        $('#response').find('.online').slideUp();
      } else {
        $('#response').find('.offline').slideDown();
        $('#response').find('.online').slideDown();
      }
    }
  }, 'li',);
  $('input').focus(function() {
    $(this).val('');
  });
  $('input').keyup(function() {
    var filter = $(this).val();
    console.log(filter);
    $('#response').find('.displayName:contains(' + filter + ')').parent().parent().slideDown();
    $('#response').find('.displayName:not(:contains(' + filter + '))').parent().parent().slideUp();
  });
  $('input').blur(function() {
    $('input').val('Filter by Stream Name')
  });
});

function channelInfo() {
  $.ajax({
    type: "GET",
    url:
      "https://api.twitch.tv/kraken/users?login=cretetion,ESL_SC2,freecodecamp,habathcx,noobs2ninjas,OgamingSC2,RobotCaleb,storbeck",
    headers: {
      "Client-ID": "dqygxz2so4b6i5frra2454hziud1m1",
      Accept: "application/vnd.twitchtv.v5+json"
    },
    success: function(data) {
      $.each(data.users, function(key, user) {
        streamers[user["display_name"]] = {};
        streamers[user["display_name"]].url =
          "https://go.twitch.tv/" + user.name;
        if (user.logo === null) {
          streamers[user["display_name"]].logo =
            "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";
        } else {
          streamers[user["display_name"]].logo = user.logo;
        }
        streamers[user["display_name"]].details = "Offline";
      });
      onlineChannel();
    }
  });
}
function onlineChannel() {
  $.ajax({
    type: "GET",
    url:
      "https://api.twitch.tv/kraken/streams/?channel=90401618,30220059,79776140,6726509,82534701,71852806,54925078,152475255",
    headers: {
      "Client-ID": "dqygxz2so4b6i5frra2454hziud1m1",
      Accept: "application/vnd.twitchtv.v5+json"
    },
    success: function(data) {
      $.each(data.streams, function(key, stream) {
        streamers[stream.channel["display_name"]].details =
          stream.game + ": " + stream.channel.status;
      });
      buildHTML();
    }
  });
}
function buildHTML() {
  $.each(streamers, function(key, streamer) {
    if (streamer.details === "Offline") {
      streamsHTML +=
        '<div class="offline">' +
        '<a href="' +
        streamer.url +
        '" target="_blank">' +
        '<div class="logoSpace"><img src="' +
        streamer.logo +
        '" alt="' +
        key +
        ' logo" class="logo"></div>' +
        '<div class="displayName dark">' +
        key +
        "</div>" +
        '<div class="details dark">' +
        streamer.details +
        "</div></a></div>";
    } else {
      streamsHTML +=
        '<div class="online">' +
        '<a href="' +
        streamer.url +
        '" target="_blank">' +
        '<div class="logoSpace"><img src="' +
        streamer.logo +
        '" alt="' +
        key +
        ' logo" class="logo"></div>' +
        '<div class="displayName light">' +
        key +
        "</div>" +
        '<div class="details light">' +
        streamer.details +
        "</div></a></div>";
    }
  });
  $("#response").html(streamsHTML);
}

//  alter the contains selector to make it case insensitive
$.expr[":"].contains = $.expr.createPseudo(function(arg) {
  return function( elem ) {
   return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
  };
});