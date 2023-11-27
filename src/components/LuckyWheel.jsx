import React, { useRef, useState, useEffect, startTransition } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Box, Html } from "@react-three/drei";
import { TextureLoader, Vector3 } from "three";

const UserBox = ({
  user,
  index,
  totalUsers,
  luckyUser,
  stopRotation,
  setStopRotation,
  hanldeWinner,
}) => {
  const meshRef = useRef();
  const angle = (index / totalUsers) * Math.PI * 2;
  const [texture, setTexture] = useState(null);
  useEffect(() => {
    const loadTexture = async () => {
      const loadedTexture = await new Promise((resolve, reject) => {
        const loader = new TextureLoader();
        loader.load(user.image_url, resolve, undefined, reject);
      });

      setTexture(loadedTexture);
    };

    loadTexture();
  }, [user.image_url]);
  console.log(meshRef.current);
  useFrame(({ clock }) => {
    if (meshRef.current && !stopRotation) {
      const radius = 5;
      const x = radius * Math.cos(angle + clock.elapsedTime * 0.5);
      const z = radius * Math.sin(angle + clock.elapsedTime * 0.5);

      meshRef.current.position.set(x, 0, z);

      // Kiểm tra xem đã có người may mắn được chọn hay chưa
      if (luckyUser && luckyUser.somayman == user.somayman) {
        // Nếu có, kiểm tra xem người đó đã đến gần góc nhìn nhất hay chưa
        const distanceToCamera = meshRef.current.position.distanceTo(
          new Vector3(0, 0, 5)
        );
        console.log(distanceToCamera);
        if (distanceToCamera < 0.1) {
          // Nếu chưa đến gần, tiếp tục quay vòng
          setStopRotation(true); // Dừng vòng quay sau khi chọn người may mắn
          hanldeWinner();
        }
      }
    }
  });

  return (
    <Box ref={meshRef} args={[2, 2, 0.2]}>
      <meshStandardMaterial map={texture} />
    </Box>
  );
};

const LuckyWheel = ({ users, setDataRandom, setWinner, giai }) => {
  const [luckyUser, setLuckyUser] = useState(null);
  const [stopRotation, setStopRotation] = useState(false);
  const [winnerHandled, setWinnerHandled] = useState(false);

  const randomFunc = () => {
    return users[Math.floor(Math.random() * users.length)];
  };

  const hanldeWinner = () => {
    if (!winnerHandled) {
      setDataRandom(
        users.filter((d) => {
          return d.qrcode !== luckyUser.qrcode;
        })
      );
      setWinner((w) => ({
        ...luckyUser,
        tengiaithuong: giai?.name,
        quanlity: giai?.quanlity,
      }));
      // const prizeRef = doc(db, "dstrunggiai", uuidv4());
      // setDoc(prizeRef, {
      //   ...luckyUser,
      //   tengiaithuong: giai?.name,
      //   idGiaiThuong: uuidv4(),
      //   quanlity: giai?.quanlity,
      // });
      setWinnerHandled(true);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const selectedUser = randomFunc();
      setLuckyUser(selectedUser);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [users]);

  return (
    <div>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} />
        {users.map((user, index) => (
          <UserBox
            hanldeWinner={hanldeWinner}
            key={user.somayman}
            setStopRotation={setStopRotation}
            user={user}
            index={index}
            totalUsers={users.length}
            luckyUser={luckyUser}
            stopRotation={stopRotation}
          />
        ))}
      </Canvas>
    </div>
  );
};

export default LuckyWheel;
