const { createApp } = Vue
createApp({
    data() {
        return {
            eventos: [] ,
            eventosCalculados: {} ,
            eventosPasados: [] ,
            eventosPorVenir: [] ,
            imprimirEventosPasados: [] ,
            imprimirEventosPorVenir: [] ,
        }
    },
    created(){
        fetch("https://mindhub-xj03.onrender.com/api/amazing")
        .then(res=>res.json())
        .then(datos=>{
            this.eventos=[...datos.events];
            for (let evento of this.eventos) {
                evento.aux= 1;
                evento.porcentaje = Math.round(Number( evento[evento.date < datos.currentDate ? 'assistance':'estimate'] / (evento.capacity / 100)));
                evento.ganancias = Number(evento.price * evento[evento.date < datos.currentDate ? 'assistance':'estimate']);
            }
            this.eventosPasados=this.eventos.filter(evento=>evento.date<datos.currentDate).sort();//filtrar pasadas
            this.eventosPorVenir=this.eventos.filter(evento=>evento.date>datos.currentDate).sort();//filtrar futuras
            this.filtrarPrimeraLinea();
            this.imprimirEventosPasados=this.reducirEventos(this.eventosPasados);
            this.imprimirEventosPorVenir=this.reducirEventos(this.eventosPorVenir);
        })
        .catch((err)=>console.log(err));
    },
    methods:{
            reducirEventos:function(eventosParaReducir){
                            let reducidas={};
                            for(let evento of eventosParaReducir) {
                                if (!Object.hasOwn(reducidas,evento.category))
                                {
                                reducidas[evento.category]={...evento};}
                                else
                                {
                                reducidas[evento.category].porcentaje+=evento.porcentaje;
                                reducidas[evento.category].ganancias+=evento.ganancias;
                                reducidas[evento.category].aux++;
                                }
                            };
                            reducidas=Object.values(reducidas);
                            reducidas.forEach(evento=>{
                                evento.porcentaje/=evento.aux;
                            })
                            return reducidas;
                        },
            filtrarPrimeraLinea:function(){
                this.eventos.sort((mayor,menor)=>mayor.porcentaje-menor.porcentaje);
                this.eventosPasados.sort((mayor,menor)=>mayor.porcentaje-menor.porcentaje);
                this.eventosCalculados.mayorPorcentaje=`${this.eventosPasados[this.eventosPasados.length-1].name} : ${this.eventosPasados[this.eventosPasados.length-1].porcentaje} %`;
                this.eventosCalculados.menorPorcentaje=`${this.eventosPasados[0].name} : ${this.eventosPasados[0].porcentaje} %`;
                this.eventosCalculados.mayorCapacidad=`${this.eventos.sort((menor,mayor)=>mayor.capacity-menor.capacity)[0].name} : ${this.eventos.sort((menor,mayor)=>mayor.capacity-menor.capacity)[0].capacity} people`;
            },
        },
    
}).mount('#vueApp')