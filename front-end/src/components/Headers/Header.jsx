import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { edunova } from "../../assets";
import { navigation } from "../../constants";
import Button from "../design/Button";
import MenuSvg from "../../assets/svg/MenuSvg";
import { HamburgerMenu } from "../design/Header";
import { useState } from "react";
import ButtonGradient from "../../assets/svg/ButtonGradient";

const Header = () => {
  const location = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  // Check if current path matches navigation item
  const isActive = (url) => {
    return location.pathname === url || 
           (url === '/' && location.pathname === '/') ||
           (url !== '/' && location.pathname.startsWith(url));
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <a className="block w-[12rem] xl:mr-8" href="#hero">
          <img src={edunova} width={190} height={40} alt="EduNova" />
        </a>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={handleClick}
                className={`block relative font-code text-2xl uppercase transition-colors hover:text-color-1 ${
                  item.onlyMobile ? "lg:hidden" : ""
                } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                  isActive(item.url) 
                    ? "text-color-1 lg:text-color-1 lg:bg-n-7/50 lg:rounded-lg lg:px-4 lg:py-2"
                    : "text-n-1 lg:text-n-1/50"
                } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
              >
                {item.title}
                {isActive(item.url) && (
                  <span className="hidden lg:block absolute -bottom-1 left-0 right-0 h-0.5 bg-color-1" />
                )}
              </a>
            ))}
          </div>

          <HamburgerMenu />
        </nav>

        <a
          href="/signup"
          className="button hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block"
        >
          Sign Up
        </a>
        <Button className="hidden lg:flex" href="/login">
          Log In
        </Button>
        <ButtonGradient/>

        <Button
          className="ml-auto lg:hidden"
          px="px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;