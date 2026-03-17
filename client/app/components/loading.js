import '../../public/template/css/loading.css'

export default function Loading(){

    return(
        <div className='loading'>
            <div className="loader">
                <div className="loader_cube loader_cube--color"></div>
                <div className="loader_cube loader_cube--glowing"></div>
            </div>
        </div>
    )

}