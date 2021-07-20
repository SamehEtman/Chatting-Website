const socket = io()
//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormButton = $messageForm.querySelector('button')
const $messageFormText = $messageForm.querySelector('input')


//templates
const $messageTemplate = document.querySelector('#message-template').innerHTML
const $message = document.querySelector('#message')
const $sideBarTemplate = document.querySelector('#sidebar-template').innerHTML
const $sideBar = document.querySelector('.chat__sidebar')
//queries
const {username , room} = Qs.parse(location.search , {ignoreQueryPrefix : true})

const autoscroll = () => {
    // New message element
    const $newMessage = $message.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $message.offsetHeight

    // Height of messages container
    const containerHeight = $message.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $message.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $message.scrollTop = $message.scrollHeight
    }
}

socket.on('message' , (message)=>{
    const html = Mustache.render($messageTemplate , {
        username : message.username,
        message : message.message,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend' , html)
    autoscroll()
})

socket.on('roomData' , ({room , users})=>{
    const html = Mustache.render($sideBarTemplate , {
        room,
        users
    })
    console.log(users)
    $sideBar.innerHTML = html
})

const $locationTemplate = document.querySelector('#location-template').innerHTML
socket.on('locationMessage' , (msg) =>{
    const html = Mustache.render($locationTemplate, {
        username : msg.username,
        url: msg.url,
        createdAt : moment(msg.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend' , html)
    autoscroll()
})



$messageForm.addEventListener('submit' , (e) =>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled' , 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage' , message , (error)=>{
        $messageFormButton.removeAttribute('disabled');
        $messageFormText.value = "";
        $messageFormText.focus();
        console.log(error);
    })
    
})

const $sendLocationButton = document.querySelector('#find-location')

$sendLocationButton.addEventListener('click' , (e)=>{
    if (!navigator.geolocation)
        return alarm(`This feature isn't supported by your browser`)
    const location = navigator.geolocation.getCurrentPosition((position)=>{

        $sendLocationButton.setAttribute('disabled' , 'disabled')
        socket.emit('sendLocation' , {
            lat : position.coords.latitude,
            long: position.coords.longitude
        } , (msg)=>{

            $sendLocationButton.removeAttribute('disabled')
            console.log(msg)
        });
    })

})

socket.emit('join' , {username , room} , (error) =>{
    if (error ){
        alert(error)
        location.href='/'
    }
    
})
