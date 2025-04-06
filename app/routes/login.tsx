import { Lock, Mail, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router";
import { Input } from "~/components/Input";
import "~/styles/wave.css";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Login" }, { name: "description", content: "Login page" }];
}

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [remember, setRemember] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const backgroundColor = darkMode ? "bg-zinc-900" : "bg-zinc-100";
  const textColor = darkMode ? "text-white" : "text-black";
  const cardBg = darkMode
    ? "bg-zinc-800 border-zinc-600"
    : "bg-white border-zinc-200";

  return (
    <div
      className={`w-full min-h-screen flex items-center justify-center px-4 relative transition-colors duration-300 ${backgroundColor} ${textColor}`}
    >
      <button
        className={`absolute z-10 bottom-4 right-4 text-sm px-3 py-1 rounded-md border border-gray-400 hover:cursor-pointer transition-colors duration-200 ${
          darkMode ? "hover:bg-zinc-700" : "hover:bg-gray-200"
        }`}
        onClick={() => setDarkMode(!darkMode)}
      >
        Switch to {darkMode ? "Light" : "Dark"}
      </button>

      <motion.div
        layout
        animate={{ height: "auto" }}
        transition={{ type: "spring", duration: 0.5 }}
        className={`w-full max-w-md rounded-xl p-6 shadow-2xl border transition-colors duration-200 ${cardBg}`}
      >
        <h2 className="text-2xl text-center font-semibold mb-6 transition-all duration-300">
          {isLogin ? "Login" : "Register"}
        </h2>

        <AnimatePresence mode="wait">
          <motion.div layout="position">
            {isLogin ? (
              <motion.form
                key="login"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                <div className="relative">
                  <Mail className="absolute top-3 left-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  <Input
                    // color="#f6339a"
                    type="email"
                    placeholder="Email"
                    className={`w-full p-3 pl-10 rounded-md focus:outline-none focus:ring-2 ${
                      darkMode
                        ? "bg-zinc-700 text-white placeholder-zinc-400"
                        : "bg-zinc-100 text-black placeholder-gray-500"
                    }`}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute top-3 left-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className={`w-full p-3 pl-10 rounded-md focus:outline-none ${
                      darkMode
                        ? "bg-zinc-700 text-white placeholder-zinc-400"
                        : "bg-zinc-100 text-black placeholder-gray-500"
                    }`}
                  />
                </div>

                <div
                  className={`flex justify-between items-center text-sm ${
                    darkMode ? "text-zinc-400" : "text-gray-600"
                  }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-zinc-800"
                      checked={remember}
                      onChange={() => setRemember(!remember)}
                    />
                    Remember me
                  </label>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-all duration-300 cursor-pointer underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <Link
                  to={"/home"}
                  className={`block w-full text-center font-semibold py-2 rounded-md transition-colors duration-200 hover:cursor-pointer text-white ${
                    darkMode ? "hover:bg-zinc-700 bg-zinc-600" : "hover:bg-zinc-700 bg-zinc-800"
                  }`}
                >
                  Log In
                </Link>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                <div className="relative">
                  <User className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Full Name"
                    className={`w-full p-3 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode
                        ? "bg-zinc-700 text-white placeholder-zinc-400"
                        : "bg-zinc-100 text-black placeholder-gray-500"
                    }`}
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Email"
                    className={`w-full p-3 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode
                        ? "bg-zinc-700 text-white placeholder-zinc-400"
                        : "bg-zinc-100 text-black placeholder-gray-500"
                    }`}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className={`w-full p-3 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode
                        ? "bg-zinc-700 text-white placeholder-zinc-400"
                        : "bg-zinc-100 text-black placeholder-gray-500"
                    }`}
                  />
                </div>
                <Link
                  to={"/home"}
                  className={`block w-full text-center font-semibold py-2 rounded-md transition-colors duration-200 hover:cursor-pointer text-white bg-zinc-800 ${
                    darkMode ? "hover:bg-zinc-700" : "hover:bg-zinc-700"
                  }`}
                >
                  Sign Up
                </Link>
              </motion.form>
            )}
          </motion.div>
        </AnimatePresence>

        <div
          className={`text-center mt-6 text-sm ${
            darkMode ? "text-zinc-400" : "text-gray-600"
          }`}
        >
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className={`underline transition duration-200 cursor-pointer hover:text-blue-400`}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </motion.div>

      <svg
        width="100%"
        height="100%"
        id="svg"
        viewBox="0 0 1440 690"
        xmlns="http://www.w3.org/2000/svg"
        className="transition duration-300 ease-in-out delay-150 wave"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="5%" stopColor="#0693e3"></stop>
            <stop offset="95%" stopColor="#ff00cc"></stop>
          </linearGradient>
        </defs>
        <path
          d="M 0,700 L 0,105 C 40.80413175077322,95.71449813635041 81.60826350154645,86.42899627270084 130,86 C 178.39173649845355,85.57100372729916 234.37107774458747,93.99851304554707 287,135 C 339.62892225541253,176.00148695445293 388.9074255201037,249.5769515451109 430,296 C 471.0925744798963,342.4230484548891 503.99922017499796,361.6936807740094 556,374 C 608.000779825002,386.3063192259906 679.0956937799043,391.6483253588517 728,394 C 776.9043062200957,396.3516746411483 803.6180047053848,395.71301779058405 849,442 C 894.3819952946152,488.28698220941595 958.4322873985566,581.4996034788124 1017,603 C 1075.5677126014434,624.5003965211876 1128.6528457003885,574.2885682941659 1169,578 C 1209.3471542996115,581.7114317058341 1236.956329799889,639.346123344524 1280,682 C 1323.043670200111,724.653876655476 1381.5218351000553,752.3269383277379 1440,780 L 1440,700 L 0,700 Z"
          stroke="none"
          strokeWidth="0"
          fill="url(#gradient)"
          fillOpacity="0.265"
          className="transition-all duration-300 ease-in-out delay-150 path-0"
        ></path>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="5%" stopColor="#0693e3"></stop>
            <stop offset="75%" stopColor="#ff00cc"></stop>
          </linearGradient>
        </defs>
        <path
          d="M 0,700 L 0,245 C 64.34899151444658,224.63269581537975 128.69798302889316,204.26539163075947 167,215 C 205.30201697110684,225.73460836924053 217.5570593988739,267.5711292923419 267,307 C 316.4429406011261,346.4288707076581 403.07377937561137,383.45009119987316 455,398 C 506.92622062438863,412.54990880012684 524.1478230986809,404.6285059081657 561,433 C 597.8521769013191,461.3714940918343 654.3349282296651,526.035885167464 703,553 C 751.6650717703349,579.964114832536 792.5124639826586,569.2279534219779 841,599 C 889.4875360173414,628.7720465780221 945.6152158396999,699.0523011446245 1004,729 C 1062.3847841603001,758.9476988553755 1123.026672658542,748.5628419995242 1172,775 C 1220.973327341458,801.4371580004758 1258.2780935261308,864.6963308572789 1301,895 C 1343.7219064738692,925.3036691427211 1391.8609532369346,922.6518345713605 1440,920 L 1440,700 L 0,700 Z"
          stroke="none"
          strokeWidth="0"
          fill="url(#gradient)"
          fillOpacity="0.4"
          className="transition-all duration-300 ease-in-out delay-150 path-1"
        ></path>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="5%" stopColor="#0693e3"></stop>
            <stop offset="85%" stopColor="#ff00cc"></stop>
          </linearGradient>
        </defs>
        <path
          d="M 0,700 L 0,385 C 52.263977371857564,392.19304634010945 104.52795474371513,399.3860926802189 152,419 C 199.47204525628487,438.6139073197811 242.15215839699704,470.6486756192339 289,500 C 335.84784160300296,529.3513243807661 386.8634116682968,556.0192048428454 435,572 C 483.1365883317032,587.9807951571546 528.3941949298159,593.2745050093844 578,607 C 627.6058050701841,620.7254949906156 681.5598086124402,642.8827751196172 729,677 C 776.4401913875598,711.1172248803828 817.3665706204235,757.1943945121468 860,796 C 902.6334293795765,834.8056054878532 946.9739089058658,866.3396468317958 996,876 C 1045.0260910941342,885.6603531682042 1098.7377937561132,873.4470181606704 1145,898 C 1191.2622062438868,922.5529818393296 1230.0749160696819,983.8722805255227 1278,1017 C 1325.9250839303181,1050.1277194744773 1382.962541965159,1055.0638597372385 1440,1060 L 1440,700 L 0,700 Z"
          stroke="none"
          strokeWidth="0"
          fill="url(#gradient)"
          fillOpacity="0.53"
          className="transition-all duration-300 ease-in-out delay-150 path-2"
        ></path>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="5%" stopColor="#0693e3"></stop>
            <stop offset="85%" stopColor="#9900ef"></stop>
          </linearGradient>
        </defs>
        <path
          d="M 0,700 L 0,525 C 60.44613920537154,510.81443469296045 120.89227841074307,496.6288693859209 166,511 C 211.10772158925693,525.3711306140791 240.87702556239924,568.2989571492769 285,606 C 329.12297443760076,643.7010428507231 387.59961933966,676.175302016971 439,687 C 490.40038066034,697.824697983029 534.7244970789607,686.9998347828385 588,718 C 641.2755029210393,749.0001652171615 703.5023923444976,821.8253588516748 746,861 C 788.4976076555024,900.1746411483252 811.2659335430488,905.6987298104629 849,917 C 886.7340664569512,928.3012701895371 939.4338734833068,945.3797219064738 1000,960 C 1060.5661265166932,974.6202780935262 1128.998572523725,986.7823825636417 1178,1011 C 1227.001427476275,1035.2176174363583 1256.5718364217928,1071.4907478389594 1297,1105 C 1337.4281635782072,1138.5092521610406 1388.7140817891036,1169.2546260805202 1440,1200 L 1440,700 L 0,700 Z"
          stroke="none"
          strokeWidth="0"
          fill="url(#gradient)"
          fillOpacity="1"
          className="transition-all duration-300 ease-in-out delay-150 path-3"
        ></path>
      </svg>
      <svg
        width="100%"
        height="100%"
        id="svg"
        viewBox="0 0 1440 390"
        xmlns="http://www.w3.org/2000/svg"
        className="transition duration-300 ease-in-out delay-150 wave-2"
      >
        <defs>
          <linearGradient id="gradient" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="5%" stopColor="#0693e3"></stop>
            <stop offset="95%" stopColor="#9900ef"></stop>
          </linearGradient>
        </defs>
        <path
          d="M 0,400 L 0,60 C 34.972834276870444,50.736348520237506 69.94566855374089,41.47269704047501 117,62 C 164.0543314462591,82.52730295952499 223.1901600619069,132.8455603583375 273,154 C 322.8098399380931,175.1544396416625 363.2936911986315,167.14506152617497 408,189 C 452.7063088013685,210.85493847382503 501.63507514356695,262.57419353696264 544,297 C 586.364924856433,331.42580646303736 622.1660082271005,348.55816432597453 655,363 C 687.8339917728995,377.44183567402547 717.7008919480309,389.19314915913924 764,407 C 810.2991080519691,424.80685084086076 873.0304239807762,448.6692390374683 923,485 C 972.9695760192238,521.3307609625317 1010.1774121288643,570.1298946909878 1055,608 C 1099.8225878711357,645.8701053090122 1152.2599275037671,672.8111821985804 1200,683 C 1247.7400724962329,693.1888178014196 1290.7828778560665,686.6253765146914 1330,705 C 1369.2171221439335,723.3746234853086 1404.6085610719667,766.6873117426543 1440,810 L 1440,400 L 0,400 Z"
          stroke="none"
          strokeWidth="0"
          fill="url(#gradient)"
          fillOpacity="0.265"
          className="transition-all duration-300 ease-in-out delay-150 path-01"
          transform="rotate(-180 720 200)"
        ></path>
        <defs>
          <linearGradient id="gradient" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="5%" stopColor="#0693e3"></stop>
            <stop offset="95%" stopColor="#9900ef"></stop>
          </linearGradient>
        </defs>
        <path
          d="M 0,400 L 0,140 C 43.5482425772818,130.08448803741328 87.0964851545636,120.16897607482659 125,128 C 162.9035148454364,135.8310239251734 195.1623019590274,161.4085837381069 244,197 C 292.8376980409726,232.5914162618931 358.2543070093268,278.19668897274573 406,308 C 453.7456929906732,337.80331102725427 483.8204700036655,351.8046603709101 522,372 C 560.1795299963345,392.1953396290899 606.463812976011,418.5846695436138 654,436 C 701.536187023989,453.4153304563862 750.3242780922902,461.85666145463495 791,491 C 831.6757219077098,520.143338545365 864.2390746548282,569.9886846378463 910,605 C 955.7609253451718,640.0113153621537 1014.7194232883965,660.1885999939793 1057,684 C 1099.2805767116035,707.8114000060207 1124.8832321915859,735.2569153862364 1161,761 C 1197.1167678084141,786.7430846137636 1243.7476479452612,810.7837384610752 1292,832 C 1340.2523520547388,853.2162615389248 1390.1261760273694,871.6081307694624 1440,890 L 1440,400 L 0,400 Z"
          stroke="none"
          strokeWidth="0"
          fill="url(#gradient)"
          fillOpacity="0.4"
          className="transition-all duration-300 ease-in-out delay-150 path-11"
          transform="rotate(-180 720 200)"
        ></path>
        <defs>
          <linearGradient id="gradient" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="5%" stopColor="#0693e3"></stop>
            <stop offset="95%" stopColor="#9900ef"></stop>
          </linearGradient>
        </defs>
        <path
          d="M 0,400 L 0,220 C 49.065751285152444,199.75454341008538 98.13150257030489,179.50908682017072 141,201 C 183.8684974296951,222.49091317982928 220.53974100393293,285.71819612940243 258,318 C 295.46025899606707,350.28180387059757 333.70953341396336,351.61812866221965 383,364 C 432.29046658603664,376.38187133778035 492.62212534021353,399.80928922171915 538,425 C 583.3778746597865,450.19071077828085 613.8019652251827,477.14471445090396 655,509 C 696.1980347748173,540.855285549096 748.1700137590555,577.6118529746652 796,600 C 843.8299862409445,622.3881470253348 887.5179797385956,630.4078736504351 928,656 C 968.4820202614044,681.5921263495649 1005.758067286562,724.7566524235947 1047,751 C 1088.241932713438,777.2433475764053 1133.4497511151562,786.5655166551861 1178,813 C 1222.5502488848438,839.4344833448139 1266.4429282528124,882.9812809556611 1310,912 C 1353.5570717471876,941.0187190443389 1396.7785358735937,955.5093595221695 1440,970 L 1440,400 L 0,400 Z"
          stroke="none"
          strokeWidth="0"
          fill="url(#gradient)"
          fillOpacity="0.53"
          className="transition-all duration-300 ease-in-out delay-150 path-21"
          transform="rotate(-180 720 200)"
        ></path>
        <defs>
          <linearGradient id="gradient" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="5%" stopColor="#0693e3"></stop>
            <stop offset="95%" stopColor="#9900ef"></stop>
          </linearGradient>
        </defs>
        <path
          d="M 0,400 L 0,300 C 29.63752237838642,306.153155817318 59.27504475677284,312.306311634636 107,326 C 154.72495524322716,339.693688365364 220.53734335129508,360.92790927877405 265,382 C 309.4626566487049,403.07209072122595 332.5755818380469,423.98205125026783 375,453 C 417.4244181619531,482.01794874973217 479.1603292965174,519.1438857201547 529,537 C 578.8396707034826,554.8561142798453 616.7831009758836,553.4424058691136 657,579 C 697.2168990241164,604.5575941308864 739.7072667999482,657.0864908033907 779,680 C 818.2927332000518,702.9135091966093 854.3878318243234,696.2116309173234 901,726 C 947.6121681756766,755.7883690826766 1004.7414059027587,822.0669855273154 1048,849 C 1091.2585940972413,875.9330144726846 1120.6465445646418,863.520426973415 1159,887 C 1197.3534554353582,910.479573026585 1244.6724158386737,969.8513065790244 1293,1003 C 1341.3275841613263,1036.1486934209756 1390.6637920806631,1043.0743467104878 1440,1050 L 1440,400 L 0,400 Z"
          stroke="none"
          strokeWidth="0"
          fill="url(#gradient)"
          fillOpacity="1"
          className="transition-all duration-300 ease-in-out delay-150 path-31"
          transform="rotate(-180 720 200)"
        ></path>
      </svg>
    </div>
  );
}
