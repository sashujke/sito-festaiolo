import json, os
p='/Users/sashasiarou/Desktop/sito festaiolo'
with open(p+'/data/gonfiabili.json') as f: items=json.load(f)
profiles=[('Castello Arcobaleno',['Castelli','Gonfiabili medi'],'6–12 anni',180),('Scivolo Jungle',['Scivoli','Gonfiabili grandi'],'6–12 anni',280),('Percorso Sportivo',['Sport e sfide','Gonfiabili grandi'],'6–12 anni',320),('Mini Salterello',['Saltarelli','Gonfiabili piccoli'],'3–6 anni',130),('Parco Acquatico',['Acquatici','Giochi d’acqua'],'6–12 anni',300),('Castello Fiaba',['Castelli','Gonfiabili medi'],'3–6 anni',190),('Sfida Calcio',['Sport e sfide','Gonfiabili grandi'],'6–12 anni',290),('Scivolo Colorato',['Scivoli','Gonfiabili medi'],'6–12 anni',240)]
for i,x in enumerate(items):
 name,cats,age,price=profiles[i%len(profiles)]
 x.update(nome=f'{name} {i//len(profiles)+1}', categorie=cats, fasciaEta=age, prezzo=price, fasciaPrezzo=('Fino a 150 €' if price<=150 else '150–300 €' if price<=300 else 'Oltre 300 €'), daVerificare=True, descrizione=f'{name.lower()} colorato per feste e compleanni. Le caratteristiche precise, la disponibilità e il prezzo finale sono da confermare.', dimensioni=x.get('dimensioni') if x.get('dimensioni') not in ('Da definire',None) else 'Misure da confermare', disponibile=None)
with open(p+'/data/gonfiabili.json','w') as f: json.dump(items,f,ensure_ascii=False,indent=2); f.write('\n')
config=json.load(open(p+'/data/config.json')); config['mostraPrezziDaVerificare']=True; config['whatsappRental']=[{'nome':'Noleggio - Marco','numero':'+39 000 000 0000'},{'nome':'Noleggio - Giulia','numero':'+39 000 000 0000'}]; config['whatsappCasa']=[{'nome':'Casa - Sara','numero':'+39 000 000 0000'},{'nome':'Casa - Luca','numero':'+39 000 000 0000'}]; config['telefono']='+39 000 000 0000'; config['email']='info@example.com'; config['whatsapp']='390000000000'
# remove placeholder filters
config['categorie']=['Tutti','Acquatici','Saltarelli','Gonfiabili piccoli','Gonfiabili medi','Gonfiabili grandi','Scivoli','Castelli','Giochi d’acqua','Sport e sfide']
config['fascePrezzo']=[{'label':'Fino a 150 €','min':0,'max':150},{'label':'150–300 €','min':150,'max':300},{'label':'Oltre 300 €','min':300,'max':None}]
config['fasceEta']=[{'label':'3–6 anni','min':3,'max':6},{'label':'6–12 anni','min':6,'max':12},{'label':'12+ anni','min':12,'max':None}]
json.dump(config,open(p+'/data/config.json','w'),ensure_ascii=False,indent=2); open(p+'/data/config.json','a').write('\n')
contacts={'rental':config['whatsappRental'],'casa':config['whatsappCasa'],'telefono':config['telefono'],'email':config['email']}
json.dump(contacts,open(p+'/data/contatti.json','w'),ensure_ascii=False,indent=2); open(p+'/data/contatti.json','a').write('\n')
photos=sorted('img/casa-del-festaiolo/'+f for f in os.listdir(p+'/img/casa-del-festaiolo') if f.endswith('.webp'))
house=json.load(open(p+'/data/casa-del-festaiolo.json')); house.update(descrizione='Spazio interno per feste e momenti conviviali; dettagli e condizioni sono da verificare.',orari='Da concordare',servizi=['Spazio per feste','Area conviviale','Prenotazione privata'],indirizzo='Indirizzo da verificare',mappa='Posizione da verificare',galleria=photos,recensioni=[],daVerificare=True,fasciaPrezzo='Da verificare',prezzo='Da verificare',capacita='Da verificare')
json.dump(house,open(p+'/data/casa-del-festaiolo.json','w'),ensure_ascii=False,indent=2); open(p+'/data/casa-del-festaiolo.json','a').write('\n')
