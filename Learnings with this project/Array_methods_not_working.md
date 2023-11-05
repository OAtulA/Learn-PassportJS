# users.find() is not working

## CODE not working

```JS
let freshUser = users.find(async (u) =>
    ( (u.name === user.name)  && await bcrypt.compare(user.password, u.password) ));

```

## REASON

I got that ```.find()``` is not suited for the ```async```  
I was damn sure from the begining these functions are worthless and  
would not be useful in the future.  

for each loop does the work in all coding languages.

## WORKING CODE

```JS
let freshUser = null;
  for (const u of users) {
    if (u.name === user.name && (await bcrypt.compare(user.password, u.password))) {
      freshUser = u;
      break;
    }
  }
if (freshUser === null){
    //working on further.
}
```
