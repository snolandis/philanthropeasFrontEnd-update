$(document).ready(function (){
	//console.log('loaded')
$('.content').load('home.html');
	// var whichUser = x;

	var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
		auth: {
			params: { scope: 'openid email' } //Details: https://auth0.com/docs/scopes
		}

	});

	$('body').on('click', '.btn-login', function(e) {
	  e.preventDefault();
	  lock.show();
	});

	 $('body').on('click', '.btn-logout', function(e) {
	   e.preventDefault();
	   logout();
	 });

	lock.on("authenticated", function(authResult) {
	    lock.getProfile(authResult.idToken, function(error, profile) {
	      if (error) {
	        // Handle error
	        return;
	      };
	     // getUser(profile);
	  console.log(authResult.idToken);
	  console.log(profile);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('userId', profile.user_id);
      // Display user information
      show_profile_info(profile);
      validateUser();
	    });
	  });
//this is call back to backend - front
  var validateUser = function(){
      var idToken = localStorage.getItem('id_token');
      var request = $.ajax({
        url: 'https://philanthropeas.herokuapp.com/dbapi',
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + idToken
        }
    });


     // might need data{title: }

		request.done(function(res){
		console.log('page loaded: ', res);
		//$('.content').html(doner_homepage.html);

		if(res === 'donerhtml'){
			callPage('donorlanding.html');
			showDonor();
			} else if (res === 'charhtml'){
				callPage('charitylanding.html')
				showCharity();
					} else { callPage('newaccount.html')


							}
		});

        // if(results === 'newaccount.html'){
        // 	// redirect to new account page
        // 	location.replace('/newaccount.html');
        // }
	};


  //retrieve the profile:
  var retrieve_profile = function() {
    var id_token = localStorage.getItem('id_token');
    if (id_token) {
      lock.getProfile(id_token, function (err, profile) {
        if (err) {
          return alert('There was an error getting the profile: ' + err.message);
        }
        // Display user information
        show_profile_info(profile);
      });
    }
  };

  var show_profile_info = function(profile) {
     $('.nickname').text(profile.nickname);
     $('.btn-login').hide();
     $('.avatar').attr('src', profile.picture).show();
     $('.btn-logout').show();
  };

  //  function findUser(){
  // 	if (whichUser === donor){
  // 		$('body').on('click','.avatar', function(e){
  // 			e.preventDefault();
  // 			callPage('donorlanding.html')
  // 		})} else {
  // 		$('body').on('click','.avatar', function(e){
  // 			e.preventDefault();
  // 			callPage('charitylanding.html')
  // 		})
  // 	}
  // }

  var logout = function() {
    localStorage.removeItem('id_token');
    window.location.href = "/";
  };

  retrieve_profile();



$('body').on('click','a',function(e){
	e.preventDefault();
	var pageRef = $(this).attr('href');
	callPage(pageRef)
});

$('body').on('click','.donor_login',function(e){
	e.preventDefault();
	console.log('clicked')
	callPage('newdonor.html')
	// var whichUser = donor;

});

$('body').on('click','.charity_login',function(e){
	e.preventDefault();
	callPage('newcharity.html')
});

$('body').on('click','#newdonor',function(e){
	e.preventDefault();
	newDonor();
	callPage ('donorlanding.html');
	// var whichUser = donor;

});

$('body').on('click', '#editdonor', function(e){
	e.preventDefault();
	editDonor();
});

$('body').on('click','#newcharity',function(e){
	e.preventDefault();
	newCharity();
	callPage('charitylanding.html');
});

$('body').on('click','#editcharity',function(e){
	e.preventDefault();
	editCharity();
});

$('body').on('click','#view',function(e){
	callPage('search.html')
});

$('body').on('click','#landing',function(e){
	callPage('donorlanding.html')
});

function callPage(pageRefInput) {

	$.ajax({
		url: pageRefInput,
		type: 'GET',
		dataType: 'html',

		success: function(res){
			$('.content').html(res);
			showDonor();
			showCharity();
		},
		error: function(err) {
			console.log('page not loaded: ', err)
		},

		complete: function( xhr, status) {
		}


	})
}


function newDonor(){
	var idToken = localStorage.getItem('id_token');
	var fullName = $('.fullName').val(),
		email = $('.email').val(),
		address = $('.address').val(),
		city = $('.city').val(),
		state = $('.state').val(),
		zip = $('.zip').val(),
		importance = $('.importance').val(),
		cause = $('.cause').val(),
		userId = localStorage.getItem('userId')
	$.ajax({
		url: 'https://philanthropeas.herokuapp.com/dbapi',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + idToken
        },
        data: {
        	fullName: fullName,
        	email: email,
        	address: address,
        	city: city,
        	state: state,
        	zip: zip,
        	importance: importance,
        	cause: cause,
        	userId:	userId
        }
	});

};


function showDonor(){
	var idToken = localStorage.getItem('id_token');
	var request = $.ajax({
						url: 'https://philanthropeas.herokuapp.com/dbapi/getdonor',
				        method: 'GET',
				        headers: {
				          'Authorization': 'Bearer ' + idToken
				        }
		});
		request.done(function(res){
			console.log(res)
				var fullName = res.fullName,
						address = res.address,
						city = res.city,
						state = res.state,
						zip = res.zip,
						cause = res.cause,
						importance = res.importance

						localStorage.setItem('id', res._id);
	        	$('form').find('.fullName').val(fullName);
						$('form').find('.address').val(address);
						$('form').find('.city').val(city);
						$('form').find('.state').val(state);
						$('form').find('.zip').val(zip);
						$('form').find('.cause').val(cause);
						$('form').find('.importance').val(importance);
	    });

};


function editDonor(){
	var idToken = localStorage.getItem('id_token');
	var fullName = $('.fullName').val(),
		email = $('.email').val(),
		address = $('.address').val(),
		city = $('.city').val(),
		state = $('.state').val(),
		zip = $('.zip').val(),
		importance = $('.importance').val(),
		cause = $('.cause').val(),
		userId = localStorage.getItem('userId'),
		id = localStorage.getItem('id')
	$.ajax({
		url: 'https://philanthropeas.herokuapp.com/dbapi',
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + idToken
        },
        data: {
        	id: localStorage.getItem('id'),
        	fullName: fullName,
        	address: address,
        	city: city,
        	state: state,
        	zip: zip
        }
	});

};

function newCharity(){
	var idToken = localStorage.getItem('id_token');
	var charityName = $('.charityName').val(),
		email = $('.email').val(),
		address = $('.address').val(),
		city = $('.city').val(),
		state = $('.state').val(),
		zip = $('.zip').val(),
		dropOff = $('.dropOff').val(),
		cause = $('.cause').val(),
		needs = $('.needs').val(),
		limitations = $('.limitations').val(),
		instructions = $('.instructions').val()
	$.ajax({
		url: 'https://philanthropeas.herokuapp.com/charityapi',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + idToken
        },
        data: {
        	charity: charityName,
        	email: email,
        	address: address,
			city: city,
        	state: state,
        	zip: zip,
        	dropoff: dropOff,
			cause: cause,
			needs: needs,
			limitations: limitations,
			instructions: instructions
        }
	});

};
function editCharity(){
	var idToken = localStorage.getItem('id_token');
	var charityName = $('.charityName').val(),
		email = $('.email').val(),
		address = $('.address').val(),
		city = $('.city').val(),
		state = $('.state').val(),
		zip = $('.zip').val(),
		dropOff = $('.dropOff').val(),
		cause = $('.cause').val(),
		needs = $('.needs').val(),
		limitations = $('.limitations').val(),
		instructions = $('.instructions').val()
	$.ajax({
		url: 'https://philanthropeas.herokuapp.com/charityapi',
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + idToken
        },
        data: {
        	charity: charityName,
        	email: email,
        	address: address,
					city: city,
        	state: state,
        	zip: zip,
        	dropoff: dropOff,
					cause: cause,
					needs: needs,
					limitations: limitations,
					instructions: instructions
        }
	});

};
function showCharity(){
	var idToken = localStorage.getItem('id_token');
	var request = $.ajax({
						url: 'https://philanthropeas.herokuapp.com/charityapi',
				        method: 'GET',
				        headers: {
				          'Authorization': 'Bearer ' + idToken
				        }
	});
		request.done(function(res){
			localStorage.setItem('id', res._id);
			$('.charitytitle').append(res.charity);
			$('.dropoff').append(res.dropoff);
			$('.instructions').append(res.instructions);
			$('.limitations').append(res.limitations);
			$('.needs').append(res.needs);

		})

};




});
