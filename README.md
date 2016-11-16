# deep-backend

# Contributor
* Windows Client Developer / collect information of deep learning [Yongho Ahn](https://github.com/YonghoAhn)
* Deep learning Developer [Yungchae Yun](https://github.com/dudco)
* Server Backend Developer [Younjune Kim](https://github.com/iwin2471)
* Forntend Developer [eunsol Kang](https://github.com/eunsolkang)
* Slave [Taejoon Park](https://github.com/puze8681)

# restful api docs
* Common Response

    HTTP 200: Success

    HTTP 400: DB error

    HTTP 401: Bad Request

    HTTP 403: Params Missing
    
* POST /auth/login : Auto Login

> Params

    id_input : id [String]
    
    pw_input : pw [String]

> Response

    HTTP 200 : UserID and token

    HTTP 401 : Access Denied
    
    
    
* POST /auth/signup : Auto Login

> Params

    id_input : id [String]
    
    pw_input : pw [String]
    
    email_input: email [String]

> Response

    HTTP 200 : UserID and token

    HTTP 401 : Access Denied
    
    
* POST /auth/auto : Auto Login

> Params

    token : token [String]

> Response

    HTTP 200 : UserID and token or apikey

    HTTP 401 : Access Denied
    
    
* POST /chat : Auto Login

> Params

    nickname : nickname [String]
    
    opponent : opponent [String]

> Response

    HTTP 200 :  retudata chating token and nickname

    HTTP 401 : Access Denied
    
    
### User
> id: user inherence id [Number]

> token: user discrimination code [String]

> user_id : User id [String required unique]

> pw : User Password [String required]

> email: user email [String]

> nick_name: user name [String]

> tag: cu [String array]

> online: is user online now? [Boolean] (if user online will return true

> firends [String array] (this array Contains ONLY inherence id)
