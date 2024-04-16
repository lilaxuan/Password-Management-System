import './HomePageContent.css';

export default function HomePageContent() {
    return (<div>
        <header>
            <h1 className='homepage-text'>Password Manager Application</h1>
        </header>
        <main>
            <section>
                <p className='homepage-text product-text'>Welcome to the Password Manager Application!
                    This web application allows users to sign up, log in, manage their passwords, edit passwords,
                    and share passwords with other users securely. Start your journey now!</p>
            </section>
            <section>
                <p className='homepage-text author'>Created by: Jiaxaun Li</p>
            </section>
        </main>

    </div>)
}